import cv2
import mediapipe as mp
import math
from enum import Enum
from collections import deque
import numpy as np
from .gesture_utils import (two_landmark_distance, calculate_angle, calculate_thumb_angle,
                  get_finger_state, map_gesture, draw_bounding_box, draw_fingertips,
                  find_boundary_lm, check_hand_direction)
from .hand import HandDetector
import time
# Constants
THUMB_THRESH = [9, 8]
NON_THUMB_THRESH = [8.6, 7.6, 6.6, 6.1]
BENT_RATIO_THRESH = [0.76, 0.88, 0.85, 0.65]
CAM_W, CAM_H = 1280, 720
TEXT_COLOR = (243, 236, 27)
LM_COLOR = (102, 255, 255)
LINE_COLOR = (51, 51, 51)
GESTURE_CONFIRMATION_FRAMES = 5
MOTION_THRESHOLD = 0.02

class Gesture(Enum):
    UNKNOWN = 0
    OPEN_PALM = 1
    POINTING = 2
    THUMBS_UP = 3
    THUMBS_DOWN = 4
    OK_SIGN = 5
    FINGERS_CROSSED = 6
    V_SIGN = 7
    HAND_ON_HEART = 8
    RUBBING_HANDS = 9
    FINGER_TAPPING = 10
    COUNTING = 11
    STEEPLING = 12
    HANDS_ON_HIPS = 13
    WAVING = 14
    BECKONING = 15
    SHUSHING = 16
    AIR_QUOTES = 17
    CHIN_STROKING = 18
    FACEPALM = 19
    CLAPPING = 20
    FINGER_WAGGING = 21
    STOP = 22
    HAND_OVER_MOUTH = 23
    TAPPING_TEMPLE = 24
    CALL_ME = 25
    MONEY = 26
    SO_SO = 27
    TIME_OUT = 28
    TWO_HAND_QUOTES = 29
    PRAYING = 30
    ROCK = 31
    PAPER = 32
    SCISSORS = 33
    ONE = 34
    TWO_YEAH = 35
    THREE = 36
    FOUR = 37
    FIVE = 38
    SIX = 39
    SEVEN = 40
    EIGHT = 41
    NINE = 42
    TEN = 43
    CLAW = 44
 
    OK = 45
    C_SHAPE = 46
    O_SHAPE = 47
    PINCH = 48

class GestureDetector:
    def __init__(self, static_image_mode=False, max_num_hands=2,
                 min_detection_confidence=0.8, min_tracking_confidence=0.5):
        self.hand_detector = HandDetector(
            static_image_mode,
            max_num_hands,
            min_detection_confidence,
            min_tracking_confidence
        )
        self.finger_states = [None] * 5
        self.detected_gesture = None

    def check_finger_states(self, hand):
        landmarks = hand['landmarks']
        label = hand['label']
        facing = hand['facing']
        joint_angles = np.zeros((5, 3))  # 5 fingers and 3 angles each

        # wrist to index finger mcp
        d1 = two_landmark_distance(landmarks[0], landmarks[5])
        
        for i in range(5):
            joints = [0, 4*i+1, 4*i+2, 4*i+3, 4*i+4]
            if i == 0:
                joint_angles[i] = np.array(
                    [calculate_thumb_angle(landmarks[joints[j:j+3]], label, facing) for j in range(3)]
                )
                self.finger_states[i] = get_finger_state(joint_angles[i], THUMB_THRESH)
            else:
                joint_angles[i] = np.array(
                    [calculate_angle(landmarks[joints[j:j+3]]) for j in range(3)]
                )
                d2 = two_landmark_distance(landmarks[joints[1]], landmarks[joints[4]])
                self.finger_states[i] = get_finger_state(joint_angles[i], NON_THUMB_THRESH)
                
                if self.finger_states[i] == 0 and d2/d1 < BENT_RATIO_THRESH[i-1]:
                    self.finger_states[i] = 1
        
        return self.finger_states
    def update_hand_motion(self, hand1_center, hand2_center):
        # Save x-movement difference of both hands over time
        diff_x = hand1_center[0] - hand2_center[0]
        self.motion_history.append(diff_x)
    def is_shushing(self, hand, pose_landmarks):
        if not pose_landmarks:
            return False

        lm = hand['landmarks']
        index_tip = lm[8]  # Index fingertip

        # Get nose/mouth center
        nose = pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.NOSE]
        mouth = pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.MOUTH_CENTER] if hasattr(mp.solutions.pose.PoseLandmark, 'MOUTH_CENTER') else None

        # Use nose as fallback if MOUTH_CENTER doesn't exist
        mouth_x, mouth_y = (mouth.x, mouth.y) if mouth else (nose.x, nose.y)

        # Distance between index finger tip and mouth
        dist = math.sqrt((index_tip[0] - mouth_x)**2 + (index_tip[1] - mouth_y)**2)

        # Check finger states
        finger_states = self.check_finger_states(hand)
        is_index_only = finger_states == [0, 1, 0, 0, 0]

        return is_index_only and dist < 0.05

    def is_rubbing_motion(self):
        if len(self.motion_history) < 6:
            return False
        
        # Look at changes in direction in x-diff
        direction_changes = 0
        prev_sign = None
        
        for i in range(1, len(self.motion_history)):
            diff = self.motion_history[i] - self.motion_history[i - 1]
            sign = 1 if diff > 0 else -1
            if prev_sign is not None and sign != prev_sign:
                direction_changes += 1
            prev_sign = sign

        # If the direction changed back-and-forth enough times = rubbing
        return direction_changes >= 3
    def is_steepling(self, hand1, hand2):
        lm1 = hand1['landmarks']
        lm2 = hand2['landmarks']

        fingertip_pairs = [(4, 4), (8, 8), (12, 12), (16, 16), (20, 20)]
        touching = 0

        for idx1, idx2 in fingertip_pairs:
            dist = math.sqrt((lm1[idx1][0] - lm2[idx2][0])**2 + (lm1[idx1][1] - lm2[idx2][1])**2)
            if dist < 0.03:
                touching += 1

        wrist_dist = math.sqrt((lm1[0][0] - lm2[0][0])**2 + (lm1[0][1] - lm2[0][1])**2)

        # Optional: ensure fingertips are higher than wrists
        fingers_above_wrists = all(
            lm1[idx][1] < lm1[0][1] and lm2[idx][1] < lm2[0][1] for idx in [8, 12]
        )

        return touching >= 3 and wrist_dist > 0.05 and fingers_above_wrists

    
    def detect_gesture(self, img, mode, draw=True):
        hands = self.hand_detector.detect_hands(img)
        self.detected_gesture = None
        pose_results = self.pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        if hands:
            if mode == 'single':
                hand = hands[-1]
                self.check_finger_states(hand)
                if draw:
                    self.draw_gesture_landmarks(img)

                # Pose-based gesture: SHUSHING
                if pose_results and pose_results.pose_landmarks:
                    if self.is_shushing(hand, pose_results.pose_landmarks):
                        self.detected_gesture = "SHUSHING"
                        return self.detected_gesture

                # Regular gesture mapping
                ges = Gesture(hand['label'])
                self.detected_gesture = map_gesture(
                    ges.gestures,
                    self.finger_states,
                    hand['landmarks'],
                    hand['wrist_angle'],
                    hand['direction'],
                    hand['boundary'])

          

            if mode == 'double' and len(hands) == 2:
                hand1 = hands[0]
                hand2 = hands[1]

                wrist1 = hand1['landmarks'][0]
                wrist2 = hand2['landmarks'][0]

                # Calculate distance between wrists
                dist = math.sqrt((wrist1[0] - wrist2[0])**2 + (wrist1[1] - wrist2[1])**2)

                # --- Check "Hands on Heart" (requires pose landmarks) ---
                if pose_results and pose_results.pose_landmarks:
                    if self.is_hands_on_heart(hands, pose_results.pose_landmarks):
                        self.detected_gesture = "HANDS_ON_HEART"
                        return self.detected_gesture  # early exit if confirmed

                # --- Check "Rubbing Hands" (requires closeness + motion) ---
                if dist < 0.1:
                    center1 = GestureRecognizer.get_hand_center_from_list(hand1['landmarks'])
                    center2 = GestureRecognizer.get_hand_center_from_list(hand2['landmarks'])
                    self.recognizer.update_hand_motion(center1, center2)

                    if self.recognizer.is_rubbing_motion():
                        self.detected_gesture = "RUBBING_HANDS"
                        return self.detected_gesture

                # --- Check "Steepling" ---
                if self.is_steepling(hand1, hand2):
                    self.detected_gesture = "STEEPLING"
                    return self.detected_gesture




                    # return self.detected_gesture
    @staticmethod
    def get_hand_center_from_list(landmarks):
        x = sum(p[0] for p in landmarks) / len(landmarks)
        y = sum(p[1] for p in landmarks) / len(landmarks)
        return (x, y)
    def draw_gesture_landmarks(self, img):
        hand = self.hand_detector.decoded_hands[-1]
        self.hand_detector.draw_landmarks(img)
        draw_fingertips(hand['landmarks'], self.finger_states, img)
    
    def draw_gesture_box(self, img):
        hand = self.hand_detector.decoded_hands[-1]
        draw_bounding_box(hand['landmarks'], self.detected_gesture, img)

class GestureRecognizer:
    def __init__(self):
        # Initialize MediaPipe solutions
        self.mp_hands = mp.solutions.hands
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        self.hands = self.mp_hands.Hands(
            max_num_hands=2, 
            min_detection_confidence=0.8, 
            min_tracking_confidence=0.5
        )
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.7, 
            min_tracking_confidence=0.5
        )
        self.gesture_history = deque(maxlen=10)
        self.motion_history = deque(maxlen=15)
        self.clap_history = deque(maxlen=5)
        self.wave_history = deque(maxlen=10)

    @staticmethod
    def calculate_distance(point1, point2):
        """Calculate distance between two points (either landmarks or coordinate tuples)"""
        # Extract coordinates from first point
        if hasattr(point1, 'x'):
            x1, y1 = point1.x, point1.y
        else:
            x1, y1 = point1[0], point1[1]
        
        # Extract coordinates from second point
        if hasattr(point2, 'x'):
            x2, y2 = point2.x, point2.y
        else:
            x2, y2 = point2[0], point2[1]
        
        return math.sqrt((x1 - x2)**2 + (y1 - y2)**2)

    @staticmethod
    def get_hand_center(hand_landmarks):
        """Calculate center of hand landmarks"""
        if not hand_landmarks:
            return (0, 0)
        x = sum(lm.x for lm in hand_landmarks.landmark) / 21
        y = sum(lm.y for lm in hand_landmarks.landmark) / 21
        return (x, y)

    def fingers_up(self, hand_landmarks):
        tips = [
            self.mp_hands.HandLandmark.INDEX_FINGER_TIP, 
            self.mp_hands.HandLandmark.MIDDLE_FINGER_TIP,
            self.mp_hands.HandLandmark.RING_FINGER_TIP,
            self.mp_hands.HandLandmark.PINKY_TIP
        ]
        
        fingers = []
        for tip in tips:
            pip = tip - 2  # PIP joint is 2 landmarks before the tip
            if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[pip].y:
                fingers.append(1)
            else:
                fingers.append(0)
        
        # Thumb is special
        thumb_tip = self.mp_hands.HandLandmark.THUMB_TIP
        thumb_ip = self.mp_hands.HandLandmark.THUMB_IP
        if hand_landmarks.landmark[thumb_tip].x < hand_landmarks.landmark[thumb_ip].x:
            fingers.insert(0, 1)
        else:
            fingers.insert(0, 0)
        
        return fingers

    def recognize_static_gesture(self, hand_landmarks):
        fingers = self.fingers_up(hand_landmarks)
        thumb_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.THUMB_TIP]
        index_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
        middle_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.MIDDLE_FINGER_TIP]
        ring_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.RING_FINGER_TIP]
        pinky_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.PINKY_TIP]
        wrist = hand_landmarks.landmark[self.mp_hands.HandLandmark.WRIST]
        
        # Calculate distances between key points
        thumb_index_dist = self.calculate_distance(thumb_tip, index_tip)
        thumb_middle_dist = self.calculate_distance(thumb_tip, middle_tip)
        thumb_pinky_dist = self.calculate_distance(thumb_tip, pinky_tip)
        index_middle_dist = self.calculate_distance(index_tip, middle_tip)
        index_ring_dist = self.calculate_distance(index_tip, ring_tip)
        index_pinky_dist = self.calculate_distance(index_tip, pinky_tip)
        index_tip_coords = (index_tip.x, index_tip.y)
        middle_tip_coords = (middle_tip.x, middle_tip.y)
        # Fingers crossed
        if (fingers[1] == 1 and fingers[2] == 1 and 
            index_middle_dist < 0.05 and 
            abs(index_tip.y - middle_tip.y) < 0.03 and 
            abs(index_tip.x - middle_tip.x) < 0.03 and 
            fingers[0] == 0 and fingers[3] == 0 and fingers[4] == 0):
            return Gesture.FINGERS_CROSSED

        # Thumbs up
        if fingers[1:] == [0, 0, 0, 0] and fingers[0] == 1:
            if thumb_tip.y < wrist.y:
                return Gesture.THUMBS_UP
        
        # Thumbs down
        if fingers[1:] == [0, 0, 0, 0] and fingers[0] == 1:
            if thumb_tip.y > wrist.y:
                return Gesture.THUMBS_DOWN
        
        # OK sign
        if (thumb_index_dist < 0.05 and 
            thumb_middle_dist > 0.1 and 
            fingers[2:] == [0, 0, 0]):
            return Gesture.OK_SIGN
        
        # V sign (peace)
        if fingers[:3] == [0, 1, 1] and fingers[3:] == [0, 0]:
            return Gesture.V_SIGN
        
        # Pointing
        if fingers == [0, 1, 0, 0, 0]:
            return Gesture.POINTING
        
        # Open palm
        if all(fingers):
            return Gesture.OPEN_PALM
        
        # Call me (shaka sign)
        if fingers == [1, 0, 0, 0, 1] and fingers[1:4] == [0, 0, 0]:
            return Gesture.CALL_ME
        
        # Rock
        if fingers == [1, 0, 0, 0, 1]:
            return Gesture.ROCK
        
        # Paper
        if all(fingers):
            return Gesture.PAPER
        
        # Scissors
        if fingers == [0, 1, 1, 0, 0]:
            return Gesture.SCISSORS
        
        # Fingers crossed
        if (fingers[1] == 1 and fingers[2] == 1 and 
            index_middle_dist < 0.05 and 
            fingers[0] == 0 and fingers[3] == 0 and fingers[4] == 0):
            return Gesture.FINGERS_CROSSED
        
        # Money gesture
        if (fingers[0] == 1 and fingers[1] == 0 and fingers[2] == 0 and 
            fingers[3] == 0 and fingers[4] == 0 and 
            thumb_index_dist < 0.05 and thumb_middle_dist < 0.05):
            return Gesture.MONEY
        
        # So-so gesture
        if (fingers[1] == 1 and fingers[2] == 0 and fingers[3] == 0 and 
            fingers[4] == 0 and fingers[0] == 0):
            return Gesture.SO_SO
        
        return Gesture.UNKNOWN
    # In recognize_static_gesture() method
    def recognize_number_gestures(fingers):
        finger_count = sum(fingers)
        if finger_count == 1 and fingers[1]:  # Only index finger up
            return Gesture.ONE
        elif finger_count == 2 and fingers[1] and fingers[2]:  # Index + middle
            return Gesture.TWO_YEAH
        elif finger_count == 3 and fingers[1] and fingers[2] and fingers[3]:
            return Gesture.THREE
        # ... continue pattern up to FIVE
        return None
    def is_finger_tapping(self, hand_landmarks):
        index_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
        middle_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.MIDDLE_FINGER_TIP]
        
        # Check if fingers are in tapping position (slightly bent)
        if (index_tip.y > middle_tip.y and 
            self.calculate_distance(index_tip, middle_tip) < 0.05):
            
            current_time = time.time()
            self.tap_history.append(current_time)
            
            # Detect rhythmic pattern (at least 3 taps in 1 second)
            if len(self.tap_history) >= 3:
                time_diff = self.tap_history[-1] - self.tap_history[0]
                return time_diff < 1.0
        return False

    def is_hands_on_heart(self, hands, pose_landmarks):
        if len(hands) != 2 or not pose_landmarks:
            return False

        hand1, hand2 = hands[0], hands[1]
        wrist1 = hand1['landmarks'][0]
        wrist2 = hand2['landmarks'][0]

        # Get chest center (midpoint between shoulders)
        left_shoulder = pose_landmarks.landmark[11]
        right_shoulder = pose_landmarks.landmark[12]
        chest_x = (left_shoulder.x + right_shoulder.x) / 2
        chest_y = (left_shoulder.y + right_shoulder.y) / 2
        chest_pos = (chest_x, chest_y)

        # Distance from each wrist to chest
        def dist_to_chest(wrist):
            return math.sqrt((wrist[0] - chest_x)**2 + (wrist[1] - chest_y)**2)

        d1 = dist_to_chest(wrist1)
        d2 = dist_to_chest(wrist2)

        # Check both hands are close to chest and fingers are relaxed
        self.check_finger_states(hand1)
        relaxed_1 = sum(self.finger_states) <= 2
        self.check_finger_states(hand2)
        relaxed_2 = sum(self.finger_states) <= 2

        return d1 < 0.15 and d2 < 0.15 and relaxed_1 and relaxed_2


    def recognize_dynamic_gesture(self):
        # Check for waving
        if len(self.motion_history) > 5:
            x_movement = sum(abs(self.motion_history[i][0] - self.motion_history[i+1][0]) 
                          for i in range(len(self.motion_history)-1))
            y_movement = sum(abs(self.motion_history[i][1] - self.motion_history[i+1][1]) 
                          for i in range(len(self.motion_history)-1))
            
            if x_movement > y_movement and x_movement > MOTION_THRESHOLD * len(self.motion_history):
                return Gesture.WAVING
        
        # Check for clapping
        if len(self.clap_history) >= 3 and sum(self.clap_history) >= 2:
            return Gesture.CLAPPING
        
        return None

    def recognize_two_hand_gesture(self, left_gesture, right_gesture, left_landmarks, right_landmarks):
        if left_gesture == Gesture.V_SIGN and right_gesture == Gesture.V_SIGN:
            return Gesture.TWO_HAND_QUOTES
        
        if left_gesture == Gesture.OPEN_PALM and right_gesture == Gesture.OPEN_PALM:
            left_center = self.get_hand_center(left_landmarks)
            right_center = self.get_hand_center(right_landmarks)
            dist = self.calculate_distance(left_center, right_center)
            if dist < 0.1:  # Threshold for hands being close together
                return Gesture.PRAYING
        
        return None

    def recognize_body_gesture(self, pose_landmarks, hand_gestures, hand_landmarks_list):
        if pose_landmarks is None or not hand_landmarks_list:
            return None
        
        # Get key body points
        left_hip = pose_landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_HIP]
        right_hip = pose_landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_HIP]
        left_shoulder = pose_landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = pose_landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_SHOULDER]
        
        # Approximate chest position as midpoint between shoulders
        chest_x = (left_shoulder.x + right_shoulder.x) / 2
        chest_y = (left_shoulder.y + right_shoulder.y) / 2
        chest = self.mp_pose.PoseLandmark(0)  # Create a dummy landmark
        chest.x = chest_x
        chest.y = chest_y
        chest.z = (left_shoulder.z + right_shoulder.z) / 2
        
        # Initialize result
        result = None
        
        # Hands on hips - check if we have at least one hand
        if len(hand_gestures) > 0:
            if (len(hand_gestures) >= 1 and hand_gestures[0] == Gesture.OPEN_PALM) or \
               (len(hand_gestures) >= 2 and hand_gestures[1] == Gesture.OPEN_PALM):
                for hand_landmarks in hand_landmarks_list:
                    if hand_landmarks:
                        wrist = hand_landmarks.landmark[self.mp_hands.HandLandmark.WRIST]
                        # Check if wrist is near hip
                        if (abs(wrist.x - left_hip.x) < 0.1 and abs(wrist.y - left_hip.y) < 0.1) or \
                           (abs(wrist.x - right_hip.x) < 0.1 and abs(wrist.y - right_hip.y) < 0.1):
                            result = Gesture.HANDS_ON_HIPS
        
        # Hand on heart - check if we have at least one hand
        if len(hand_gestures) > 0:
            for hand_landmarks in hand_landmarks_list:
                if hand_landmarks:
                    wrist = hand_landmarks.landmark[self.mp_hands.HandLandmark.WRIST]
                    if self.calculate_distance(wrist, chest) < 0.15:
                        result = Gesture.HAND_ON_HEART
        
        return result

    @staticmethod
    def draw_gesture_info(image, gesture, hand_landmarks=None, position=None):
        h, w, _ = image.shape
        
        if position is None and hand_landmarks:
            x_min = min([lm.x for lm in hand_landmarks.landmark]) * w
            y_min = min([lm.y for lm in hand_landmarks.landmark]) * h
            position = (int(x_min), int(y_min - 10))
        elif position is None:
            position = (20, 50)
        
        cv2.putText(image, f"Gesture: {gesture.name}", 
                    position, 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    def process_frame(self, image):
        # Flip the image horizontally for a mirror effect
        # image = cv2.flip(image, 1)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Process the image and detect hands and pose
        hand_results = self.hands.process(rgb_image)
        pose_results = self.pose.process(rgb_image)
        
        current_gestures = []
        current_landmarks = []
        static_gesture= None
        two_hand_gesture=None
        body_gesture=None
        dynamic_gesture=None
        
        if hand_results.multi_hand_landmarks:
            for i, hand_landmarks in enumerate(hand_results.multi_hand_landmarks):
                # Recognize static gesture
                static_gesture = self.recognize_static_gesture(hand_landmarks)
                current_gestures.append(static_gesture)
                current_landmarks.append(hand_landmarks)
                
                # Track hand motion
                hand_center = self.get_hand_center(hand_landmarks)
                self.motion_history.append(hand_center)
                
                # Draw hand landmarks
                self.mp_drawing.draw_landmarks(
                    image, hand_landmarks, self.mp_hands.HAND_CONNECTIONS,
                    self.mp_drawing_styles.get_default_hand_landmarks_style(),
                    self.mp_drawing_styles.get_default_hand_connections_style())
                
                # Display recognized gesture
                self.draw_gesture_info(image, static_gesture, hand_landmarks)
        
        # Recognize dynamic gestures
        dynamic_gesture = self.recognize_dynamic_gesture()
        if dynamic_gesture:
            self.draw_gesture_info(image, dynamic_gesture, position=(20, 20))
        
        # Recognize two-hand gestures
        if len(current_gestures) == 2 and len(current_landmarks) == 2:
            two_hand_gesture = self.recognize_two_hand_gesture(
                current_gestures[0],
                current_gestures[1],
                current_landmarks[0],
                current_landmarks[1]
            )
            if two_hand_gesture:
                self.draw_gesture_info(image, two_hand_gesture, position=(20, 80))
        
        # Recognize body-related gestures
        body_gesture = None
        if pose_results.pose_landmarks and current_landmarks:
            body_gesture = self.recognize_body_gesture(
                pose_results.pose_landmarks, 
                current_gestures, 
                current_landmarks
            )
        if body_gesture:
            self.draw_gesture_info(image, body_gesture, position=(20, 110))
        
        # Update clap history (simplified - would need better detection)
        if len(current_gestures) == 2:
            left_center = self.get_hand_center(current_landmarks[0])
            right_center = self.get_hand_center(current_landmarks[1])
            dist = self.calculate_distance(left_center, right_center)

            self.clap_history.append(1 if dist < 0.1 else 0)
        
        # Draw pose landmarks if needed
        if pose_results.pose_landmarks:
            ...
            # self.mp_drawing.draw_landmarks(
            #     image, pose_results.pose_landmarks, self.mp_pose.POSE_CONNECTIONS,
            #     landmark_drawing_spec=self.mp_drawing_styles.get_default_pose_landmarks_style())
        
        return [
            image, 
                {
                    "body_gesture":body_gesture, 
                    "static_gesture":static_gesture, 
                    "dynamic_gesture":dynamic_gesture,
                      "two_hand_gesture":two_hand_gesture
                      }
            ]

def main():
    recognizer = GestureRecognizer()
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            continue
        
        image, _= recognizer.process_frame(image)
        cv2.imshow('Advanced Gesture Recognition', image)
        
        if cv2.waitKey(5) & 0xFF == 27:  # ESC key to exit
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()