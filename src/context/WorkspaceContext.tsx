'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  currentWorkspaceSlug: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  currentUser: UserProfile | null;
  selectWorkspace: (slug: string) => Promise<void>;
  isLoading: boolean;
}

const defaultWorkspace: Workspace = {
  id: 'ws-default',
  name: 'Main Client Workspace',
  slug: 'social-swarm-default',
  description: 'Enterprise AI Operations',
};

const defaultUser: UserProfile = {
  id: 'usr-1',
  name: 'Totok Michael',
  email: 'tmichael20@mail.com',
  avatar: '🧔‍♂️',
  role: 'Lead Operations Manager',
  currentWorkspaceSlug: 'social-swarm-default',
};

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaces: [defaultWorkspace],
  currentWorkspace: defaultWorkspace,
  currentUser: defaultUser,
  selectWorkspace: async () => {},
  isLoading: false,
});

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([defaultWorkspace]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(defaultWorkspace);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadWorkspacesAndUser() {
      try {
        const [wsList, user] = await Promise.all([
          api.getWorkspaces().catch(() => [defaultWorkspace]),
          api.getCurrentUser().catch(() => defaultUser),
        ]);

        setWorkspaces(wsList.length > 0 ? wsList : [defaultWorkspace]);
        setCurrentUser(user);

        const matched = wsList.find((w) => w.slug === user.currentWorkspaceSlug) || wsList[0] || defaultWorkspace;
        setCurrentWorkspace(matched);
      } catch (err) {
        console.error('Failed to load workspace session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkspacesAndUser();
  }, []);

  const selectWorkspace = async (slug: string) => {
    try {
      await api.switchWorkspace(slug);
      const target = workspaces.find((w) => w.slug === slug);
      if (target) {
        setCurrentWorkspace(target);
      }
      if (currentUser) {
        setCurrentUser({ ...currentUser, currentWorkspaceSlug: slug });
      }
    } catch (err) {
      console.error('Failed to switch workspace:', err);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        currentUser,
        selectWorkspace,
        isLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
