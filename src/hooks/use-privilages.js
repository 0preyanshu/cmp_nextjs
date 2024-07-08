
'use client'
import { useMemo } from 'react';
import { useUser } from './use-user'; // Adjust the import path according to your project structure
import { Privilages } from '../components/core/privilages';



const getAllPrivileges = () => {
  const allPrivileges = [];

  Privilages.genericPrivilages.forEach(privilege => {
    allPrivileges.push(privilege);
  });


  Object.values(Privilages.nestedPrivilages).forEach(privilegesArray => {
    privilegesArray.forEach(privilege => {
      allPrivileges.push(privilege);
    });
  });

  return allPrivileges;
};

const allPrivileges = getAllPrivileges();

export const useUserPrivileges = () => {
  const { user } = useUser();

  const userPrivilegesMap = useMemo(() => {
    const userPrivileges = user?.defaultPrivileges || [];

    const userPrivilegesIds = userPrivileges
    
    const privilegesMap = {};
    
    allPrivileges.forEach(privilege => {
      // privilegesMap[privilege.privilegeName] = userPrivilegesIds.includes(String(privilege.id));
      privilegesMap[privilege.privilegeName] = true
    });

    return privilegesMap;
  }, [user]);

  return userPrivilegesMap;
};
