import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SchoolProfile = () => {
  const [previewImage, setPreviewImage] = useState("/placeholder-profile.jpg");
  const [schoolName, setSchoolName] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [backupAddress, setBackupAddress] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admin Account Overview</h2>
      </div>

      <form className="space-y-8">
        {/* School Logo Upload */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold">School Logo</h3>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <img
              src={previewImage}
              alt="School Logo Preview"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover"
            />
            <div className="text-center md:text-left">
              <Label htmlFor="schoolLogo" className="block">Upload Your School Logo</Label>
              <Input
                id="schoolLogo"
                type="file"
                accept="image/png"
                className="mt-2"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </section>

        {/* Admin Info */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold">Admin Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                placeholder="Enter School Name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Address Info */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold">Office Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="officeAddress">Office Address</Label>
              <Textarea
                id="officeAddress"
                placeholder="Enter Office Address"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backupAddress">Backup Address</Label>
              <Textarea
                id="backupAddress"
                placeholder="Enter Backup Address"
                value={backupAddress}
                onChange={(e) => setBackupAddress(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default SchoolProfile;
