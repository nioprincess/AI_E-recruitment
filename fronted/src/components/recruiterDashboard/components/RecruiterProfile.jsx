import React, { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Edit,
  MapPin,
  Plus,
  X,
  Save,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import useUserAxios from "../../../hooks/useUserAxios";
import useUser from "../../../hooks/useUser";

const RecruiterProfile = () => {
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const axios = useUserAxios();
  const [hasCompany, setHasCompany] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const user = useUser();
  // Company form state matching the Company model
  const [companyForm, setCompanyForm] = useState({
    c_name: "",
    c_type: "",
    c_industry: "",
    c_reg_number: "",
    c_address: "",
    c_website: "",
    c_logo: "",
    c_email: "",
    c_phone: "",
    c_description: "",
  });

  // Address form state matching the AddressSerializer
  const [addressForm, setAddressForm] = useState({
    a_country: "",
    a_province_state: "",
    a_address_line1: "",
    a_address_line2: "",
    a_city: "",
    a_postal_code: "",
  });

  // Sample company data for display
  const [companyData, setCompanyData] = useState({
    c_name: "",
    c_type: "",
    c_industry: "",
    c_reg_number: "",
    c_address: "",
    c_website: "",
    c_logo: "",
    c_email: "",
    c_phone: "",
    c_description: "",
  });

  const [currentCompanyAddress, setCurrentCompanyAddress] = useState(null);
  const handleCompanyChange = (field, value) => {
    setCompanyForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveCompany = async () => {
    console.log("SAving company information");
    try {
      let resp = null;
      if (hasCompany) {
        resp = await axios.patch(
          `/api/companies/${companyData.id}/`,
          companyForm
        );
      } else {
        resp = await axios.post(`/api/companies/`, companyForm);
      }
      if (resp.data.success) {
        setCompanyData(resp.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditingCompany(false);
    }
  };
  const getCompanyInfo = async () => {
    try {
      const resp = await axios.get(`/api/companies/my_company/`);
      if (resp.data.success) {
        if (resp.data.data) {
          setCompanyData(resp.data.data);
          setHasCompany(true);
        }
      }
    } catch (error) {}
  };

  const getCurrentCompanyAddress = async () => {
    try {
      const resp = await axios.get(
        `/api/companies/address?c_id=${companyData.id}`
      );
      if (resp.data.success) {
        setCurrentCompanyAddress(resp.data.data);
        setHasAddress(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveAddress = async () => {
    try {
      setIsAddingAddress(true);
      console.log(addressForm);
      let resp = null;
      if (hasAddress) {
        resp = await axios.patch(`/api/companies/address/`, addressForm);
      } else {
        resp = await axios.post(`/api/companies/address/`, addressForm);
      }
      if (resp.data.success) {
        setCurrentCompanyAddress(resp.data.data);
        // Reset form
        setAddressForm({
          a_country: "",
          a_province_state: "",
          a_address_line1: "",
          a_address_line2: "",
          a_city: "",
          a_postal_code: "",
        });
        setHasAddress(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAddingAddress(false);
    }
  };
  useEffect(() => {
    getCompanyInfo();
  }, []);

  useEffect(() => {
    if (String(companyData?.c_address).length > 1) {
      getCurrentCompanyAddress();
    }
  }, [companyData]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground dark:text-white">
          Company Profile
        </h1>

        <div className="flex gap-2">
          <button
            className="bg-white flex justify-between items-center p-2 rounded-md"
            onClick={() => {
              if (hasAddress) {
                setAddressForm({ ...currentCompanyAddress });
              }
              setIsAddingAddress(true);
            }}
          >
            <MapPin className="h-4 w-4 mr-2" />{" "}
            {hasAddress ? "Edit Address" : "Add Address"}
          </button>
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => {
              setCompanyForm(companyData);
              setIsEditingCompany(true);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />{" "}
            {hasCompany ? "Edit Company" : "Add Company"}
          </Button>
        </div>
      </div>

      {/* Company Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <img
            src={companyData.c_logo}
            alt="Company Logo"
            className="w-24 h-24 rounded-lg object-cover border dark:border-gray-700"
          />
          <div className="space-y-3 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Company Name</p>
                <p className="text-muted-foreground">{companyData.c_name}</p>
              </div>
              <div>
                <p className="font-semibold">Company Type</p>
                <p className="text-muted-foreground">{companyData.c_type}</p>
              </div>
              <div>
                <p className="font-semibold">Industry</p>
                <p className="text-muted-foreground">
                  {companyData.c_industry}
                </p>
              </div>
              <div>
                <p className="font-semibold">Registration Number</p>
                <p className="text-muted-foreground">
                  {companyData.c_reg_number}
                </p>
              </div>
              <div>
                <p className="font-semibold">Address ID</p>
                <p className="text-muted-foreground">{companyData.c_address}</p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                <a
                  href={companyData.c_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {companyData.c_website}
                </a>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {companyData.c_email}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> {companyData.c_phone}
              </p>
            </div>

            <div>
              <p className="font-semibold">Company Type</p>
              <p className="text-muted-foreground">{companyData.c_type}</p>
            </div>
            <div>
              <p className="font-semibold">Company Industry</p>
              <p className="text-muted-foreground">{companyData.c_industry}</p>
            </div>

            <div className="pt-2">
              <p className="font-semibold">Description</p>
              <p className="text-muted-foreground">
                {companyData.c_description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addresses Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              key={currentCompanyAddress?.id}
              className="p-4 border rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Address Line 1</p>
                  <p className="text-muted-foreground">
                    {currentCompanyAddress?.a_address_line1}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Address Line 2</p>
                  <p className="text-muted-foreground">
                    {currentCompanyAddress?.a_address_line2}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">City</p>
                  <p className="text-muted-foreground">
                    {currentCompanyAddress?.a_city}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Province/State</p>
                  <p className="text-muted-foreground">
                    {currentCompanyAddress?.a_province_state}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Country</p>
                  <p className="text-muted-foreground">
                    {currentCompanyAddress?.a_country}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Postal Code</p>
                  <p className="text-muted-foreground">
                    {currentCompanyAddress?.a_postal_code}
                  </p>
                </div>
              </div>
            </div>

            {currentCompanyAddress == null && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No addresses added yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Company Modal */}
      {isEditingCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-lg bg-white dark:bg-gray-700 w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold dark:text-gray-50">
                {hasCompany ? "Edit Company Profile" : "Add Company Profile"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingCompany(false)}
              >
                <X className="h-5 w-5 dark:text-gray-50" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label
                    htmlFor="c_type"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Company Name
                  </label>
                  <Input
                    id="c_name"
                    value={companyForm.c_name}
                    onChange={(e) =>  handleCompanyChange("c_name", e.target.value)}
                    placeholder="e.g., Corporation, LLC, Startup"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c_type"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Company Type
                  </label>
                  <Input
                    id="c_type"
                    value={companyForm.c_type}
                    onChange={(e) =>
                      handleCompanyChange("c_type", e.target.value)
                    }
                    placeholder="e.g., Corporation, LLC, Startup"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c_industry"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Industry
                  </label>
                  <Input
                    id="c_industry"
                    value={companyForm.c_industry}
                    onChange={(e) =>
                      handleCompanyChange("c_industry", e.target.value)
                    }
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c_reg_number"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Registration Number
                  </label>
                  <Input
                    id="c_reg_number"
                    value={companyForm.c_reg_number}
                    onChange={(e) =>
                      handleCompanyChange("c_reg_number", e.target.value)
                    }
                    placeholder="Enter registration number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c_website"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Website
                  </label>
                  <Input
                    id="c_website"
                    value={companyForm.c_website}
                    onChange={(e) =>
                      handleCompanyChange("c_website", e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c_logo"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Logo URL
                  </label>
                  <Input
                    id="c_logo"
                    value={companyForm.c_logo}
                    onChange={(e) =>
                      handleCompanyChange("c_logo", e.target.value)
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c_email"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <Input
                    id="c_email"
                    type="email"
                    value={companyForm.c_email}
                    onChange={(e) =>
                      handleCompanyChange("c_email", e.target.value)
                    }
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c_phone"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Phone
                  </label>
                  <Input
                    id="c_phone"
                    value={companyForm.c_phone}
                    onChange={(e) =>
                      handleCompanyChange("c_phone", e.target.value)
                    }
                    placeholder="+250 XXX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="c_description"
                  className="block text-sm font-medium mb-1 dark:text-gray-300"
                >
                  Company Description
                </label>
                <Textarea
                  id="c_description"
                  rows={4}
                  value={companyForm.c_description}
                  onChange={(e) =>
                    handleCompanyChange("c_description", e.target.value)
                  }
                  placeholder="Describe your company..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditingCompany(false)}
                className="dark:text-gray-50"
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveCompany}
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddingAddress && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-lg bg-white dark:bg-gray-700 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold dark:text-gray-50">
                {hasAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddingAddress(false)}
              >
                <X className="h-5 w-5 dark:text-gray-50" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="a_country"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Country *
                  </label>
                  <Input
                    id="a_country"
                    value={addressForm.a_country}
                    onChange={(e) =>
                      handleAddressChange("a_country", e.target.value)
                    }
                    placeholder="Enter country"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="a_province_state"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Province/State *
                  </label>
                  <Input
                    id="a_province_state"
                    value={addressForm.a_province_state}
                    onChange={(e) =>
                      handleAddressChange("a_province_state", e.target.value)
                    }
                    placeholder="Enter province or state"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="a_city"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    City *
                  </label>
                  <Input
                    id="a_city"
                    value={addressForm.a_city}
                    onChange={(e) =>
                      handleAddressChange("a_city", e.target.value)
                    }
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="a_postal_code"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Postal Code
                  </label>
                  <Input
                    id="a_postal_code"
                    value={addressForm.a_postal_code}
                    onChange={(e) =>
                      handleAddressChange("a_postal_code", e.target.value)
                    }
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="a_address_line1"
                  className="block text-sm font-medium mb-1 dark:text-gray-300"
                >
                  Address Line 1 *
                </label>
                <Input
                  id="a_address_line1"
                  value={addressForm.a_address_line1}
                  onChange={(e) =>
                    handleAddressChange("a_address_line1", e.target.value)
                  }
                  placeholder="Enter street address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="a_address_line2"
                  className="block text-sm font-medium mb-1 dark:text-gray-300"
                >
                  Address Line 2
                </label>
                <Input
                  id="a_address_line2"
                  value={addressForm.a_address_line2}
                  onChange={(e) =>
                    handleAddressChange("a_address_line2", e.target.value)
                  }
                  placeholder="Apartment, suite, unit, etc. (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddingAddress(false)}
                className="dark:text-gray-50"
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveAddress}
              >
                Save Address
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterProfile;
