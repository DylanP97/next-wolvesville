"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Card,
  CardBody,
  User,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";

const RoleSelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  availableRoles,
  room,
  username,
}) => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(null);

  // Get available roles for selection (roles that are in selectedRoles but not yet assigned)
  const getAvailableRolesForSelection = () => {
    if (!room || !room.selectedRoles) return [];
    
    // Get roles already assigned
    const assignedRoles = room.roleAssignments 
      ? Object.values(room.roleAssignments).filter(r => r !== null)
      : [];
    
    // Get roles assigned to users already in room
    const userAssignedRoles = room.usersInTheRoom
      ? room.usersInTheRoom
          .filter(u => u.preferredRole)
          .map(u => u.preferredRole)
      : [];
    
    const allAssigned = [...assignedRoles, ...userAssignedRoles];
    
    // Return roles that are in selectedRoles but not fully assigned
    const roleCounts = {};
    room.selectedRoles.forEach(role => {
      roleCounts[role.name] = (roleCounts[role.name] || 0) + 1;
    });
    
    const assignedCounts = {};
    allAssigned.forEach(roleName => {
      assignedCounts[roleName] = (assignedCounts[roleName] || 0) + 1;
    });
    
    // Get unique roles from selectedRoles
    const uniqueRoles = room.selectedRoles.filter((role, index, self) =>
      index === self.findIndex(r => r.name === role.name)
    );
    
    return uniqueRoles.filter(role => {
      const available = roleCounts[role.name] || 0;
      const assigned = assignedCounts[role.name] || 0;
      return assigned < available;
    });
  };

  const availableRolesForSelection = getAvailableRolesForSelection();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(selectedRole);
    }
    setSelectedRole(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedRole(null);
    onClose();
  };

  const getTranslatedRoleName = (roleName) => {
    if (!roleName) return null;
    const role = availableRolesForSelection.find((r) => r.name === roleName);
    return role ? (i18n.language === "fr" ? role.nameFR : role.name) : roleName;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      isDismissable={false}
      isKeyboardDismissable={false}
      classNames={{
        base: "bg-slate-900",
        header: "border-b border-white/10",
        body: "py-6",
        footer: "border-t border-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-white text-xl font-bold font-wolf">
            {t("join.selectYourRole") || "Select Your Role"}
          </h2>
          <p className="text-white/70 text-sm font-normal">
            {t("join.selectRoleDescription") || "Choose a role for this game, or leave it random."}
          </p>
        </ModalHeader>
        <ModalBody>
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardBody className="p-4">
              <Select
                label={t("join.yourRole") || "Your Role"}
                placeholder={t("join.selectRole") || "Select a role (optional)"}
                className="bg-white rounded-xl"
                selectedKeys={selectedRole ? [selectedRole] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] || null;
                  setSelectedRole(selected);
                }}
              >
                <SelectItem
                  key="none"
                  value=""
                  className="text-slate-800"
                >
                  {t("join.randomRole") || "Random (no preference)"}
                </SelectItem>
                {availableRolesForSelection.map((role) => (
                  <SelectItem
                    key={role.name}
                    value={role.name}
                    className="text-slate-800"
                    startContent={
                      <img src={role.image} alt={role.name} className="w-6 h-6 rounded" />
                    }
                  >
                    {i18n.language === "fr" ? role.nameFR : role.name}
                  </SelectItem>
                ))}
              </Select>

              {selectedRole && (
                <div className="mt-4 flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl p-3">
                  <User
                    name={getTranslatedRoleName(selectedRole)}
                    avatarProps={{
                      size: "sm",
                      src: availableRolesForSelection.find((r) => r.name === selectedRole)?.image,
                      radius: "lg",
                    }}
                    className="text-white"
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            variant="flat"
            onPress={handleClose}
          >
            {t("join.cancel") || "Cancel"}
          </Button>
          <Button
            color="primary"
            variant="shadow"
            onPress={handleConfirm}
            className="font-semibold"
          >
            {t("join.confirm") || "Confirm"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoleSelectionModal;

