import React, { useState, useEffect } from 'react';
import { User } from '@/types/models';
import { updateUser } from '@/lib/users';
import { updateState } from '@/utils/stateHelpers';
import { isUser } from '@/utils/typeGuards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface UserProfileFormProps {
  user?: User;
  onSave?: (user: User) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ 
  user,
  onSave = () => {}
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    email: '',
    role: '',
    status: 'active',
    mfa_enabled: false
  });

  // Type-safe update using our updateState helper
  const updateFormField = (field: keyof User, value: any) => {
    updateState(setFormData, { [field]: value });
  };

  // When the user prop changes, update the form data
  useEffect(() => {
    if (user && isUser(user)) {
      setFormData(user);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Only send updatable fields
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.id) {
        const updatedUser = await updateUser(formData.id, updateData);
        
        if (updatedUser) {
          toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully',
          });
          
          onSave(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormField('name', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormField('email', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              disabled={true}
              readOnly
            />
          </div>
          
          <CardFooter className="px-0">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm; 