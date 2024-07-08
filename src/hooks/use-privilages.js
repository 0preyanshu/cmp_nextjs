
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
    // const userPrivileges = user?.defaultPrivileges || [];
    const userPrivileges = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57']
    ;

    const userPrivilegesIds = userPrivileges
    
    const privilegesMap = {};
    
    allPrivileges.forEach(privilege => {
      privilegesMap[privilege.privilegeName] = userPrivilegesIds.includes(String(privilege.id));
      // privilegesMap[privilege.privilegeName] = true
    });

    return privilegesMap;
  }, [user]);

  return userPrivilegesMap;
};
