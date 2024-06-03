import { paths } from '@/paths';

export const layoutConfig = {
  navItems: [
  
    {
      key: 'general',
      title: 'General',
      items: [
        {
          key: 'settings',
          title: 'Settings',
          icon: 'gear',
          items: [
            { key: 'company information', title: 'Company information', href: paths.dashboard.companyinformation.list },
            { key: 'coursecategories', title: 'Course Categories', href: paths.dashboard.coursecategories.list },
            { key: 'courses', title: 'Courses', href: paths.dashboard.courses.list  },
            { key: 'country', title: 'Country', href: paths.dashboard.countries.list},
            { key: 'state', title: 'State', href: paths.dashboard.states.list  },
            { key: 'city', title: 'City', href: paths.dashboard.cities.list },
            { key: 'tax', title: 'Tax', href: paths.dashboard.taxes.list  },
            { key: 'currency', title: 'Currency', href: paths.dashboard.currencies.list  },
            { key: 'timezone', title: 'Time Zone', href: paths.dashboard.timezones.list  },
            // { key: 'emailapi', title: 'Email API', href: paths.dashboard.emailapi.list  },

          
     
          ],
        }
      ]
    }

    
  ],
};
