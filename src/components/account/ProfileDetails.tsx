import { useEffect, useState } from "react";

interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string;
}

interface ProfileDetailsProps {
  profile: ProfileInfo;
  onProfileUpdate: (updatedProfile: ProfileInfo) => Promise<void>;
  onPasswordUpdate: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
}

const ProfileDetails = ({
  profile,
  onProfileUpdate,
  onPasswordUpdate
}: ProfileDetailsProps) => {
  const [profileForm, setProfileForm] = useState<ProfileInfo>(profile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingProfile(true);
    try {
      await onProfileUpdate(profileForm);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(null);

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Please enter and confirm your new password.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await onPasswordUpdate(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div>
          <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">Personal Info</h3>
          <p className="text-sm text-muted-foreground">Update your account details.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">First Name</label>
            <input
              type="text"
              value={profileForm.firstName}
              onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              className="w-full border border-border bg-background px-4 py-3 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Last Name</label>
            <input
              type="text"
              value={profileForm.lastName}
              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              className="w-full border border-border bg-background px-4 py-3 text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Email</label>
          <input
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            className="w-full border border-border bg-muted/40 px-4 py-3 text-sm"
            disabled
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Phone</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full border border-border bg-background px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Gender</label>
            <select
              value={profileForm.gender || ""}
              onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
              className="w-full border border-border bg-background px-4 py-3 text-sm"
            >
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Non-binary</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary text-sm"
          disabled={isSavingProfile}
        >
          {isSavingProfile ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div>
          <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">Security</h3>
          <p className="text-sm text-muted-foreground">Change your account password.</p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Current Password</label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            className="w-full border border-border bg-background px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">New Password</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            className="w-full border border-border bg-background px-4 py-3 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Confirm Password</label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            className="w-full border border-border bg-background px-4 py-3 text-sm"
            required
          />
        </div>

        {passwordError && (
          <p className="text-sm text-destructive">{passwordError}</p>
        )}

        <button
          type="submit"
          className="btn-primary text-sm"
          disabled={isSavingPassword}
        >
          {isSavingPassword ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ProfileDetails;