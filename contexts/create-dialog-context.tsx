"use client";

import React, { createContext, useContext, useState } from "react";

interface CreateDialogContextType {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
}

const CreateDialogContext = createContext<CreateDialogContextType | undefined>(
  undefined
);

export function CreateDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const openCreateDialog = () => setIsCreateDialogOpen(true);
  const closeCreateDialog = () => setIsCreateDialogOpen(false);

  return (
    <CreateDialogContext.Provider
      value={{
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        openCreateDialog,
        closeCreateDialog,
      }}
    >
      {children}
    </CreateDialogContext.Provider>
  );
}

export function useCreateDialog() {
  const context = useContext(CreateDialogContext);
  if (context === undefined) {
    throw new Error(
      "useCreateDialog must be used within a CreateDialogProvider"
    );
  }
  return context;
}
