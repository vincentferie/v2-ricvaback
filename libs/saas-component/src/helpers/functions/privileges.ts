import { UUIDVersion } from 'class-validator';

export const getMenuRole = (menus: any[], role: UUIDVersion) => {
  const filteringMenu = menuHasRole(menus, role);
  return filteringMenu.filter((item) => item != null);
};

// Recurcive function for my bro Djama
export const menuHasRole = (menus, role) => {
  let menuFiltering = [];
  const menuData = [...menus].map((menu) => ({ ...menu }));
  menuData.forEach((menu) => {
    if (menu.role && menu.role.includes(role)) {
      if (menu.children) {
        menu.children = menuHasRole(menu.children, role);
      }
      delete menu.role;
      menuFiltering = [...menuFiltering, menu];
    }
  });
  return menuFiltering;
};

// Recurcive function retrieve NxgPermission
export const getNgxPermissionRole = (rules: any[], role: UUIDVersion) => {
  const selectedRules: any = rules.find((rule) => rule.id === role.toString());
  return selectedRules.rules;
};
