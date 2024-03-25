import React from "react";
import { Input, Button } from "antd";
import { Label } from "@/components/ui/label";

const PasswordChangeSection = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  onSubmit,
}) => {
  return (
    <div className="container mt-5">
      <Label className="text-lg mr-2">Change Password:</Label>
      <div className="mb-3">
        <Input.Password
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old Password"
        />
      </div>
      <div className="mb-3">
        <Input.Password
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
      </div>
      <div className="mb-3">
        <Input.Password
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm New Password"
          onPaste={(e) => e.preventDefault()}
        />
      </div>
      <div style={{ marginTop: "25px" }}>
        <Button className="yellowButton" onClick={onSubmit}>
          Change Password
        </Button>
      </div>
    </div>
  );
};

export default PasswordChangeSection;
