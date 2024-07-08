import { paths } from '@/paths';

export const layoutConfig = {
  navItems: [
  
    {
      key: 'general',
      title: 'General',
      items: [,

        {
          key: 'Performance',
          title: 'Performance',
          icon: 'gauge',
          items: [
            // { key: 'order', title: 'Instructors', href: paths.dashboard.instructors.list },
            { key: 'Dashboard', title: 'Dashboard', href: paths.dashboard.overview },
            { key: 'Event Registration', title: 'Event Registration', href: paths.dashboard.eventregistration.list },
            { key: 'Orders', title: 'Orders', href: paths.dashboard.orders.list },
            { key: 'Abandoned Carts', title: 'Abandoned Carts', href: paths.dashboard.abandonedcart.list },
            { key: 'Waiting List', title: 'Waiting List', href: paths.dashboard.waitlist.list },
            

            

          
     
          ]
        },
        {
          key: 'Operations',
          title: 'Operations',
          icon: 'chart-pie',
          items: [
          
            { key: 'Event Managment', title: 'Event Managment', href: paths.dashboard.eventmanagement.list },
            { key: 'Coupons', title: 'Coupons', href: paths.dashboard.coupons.list },
            { key: 'Instructors', title: 'Instructors', href: paths.dashboard.instructors.list },
            { key: 'Vendors', title: 'Vendors', href: paths.dashboard.vendors.list },
            { key: 'System Emails', title: 'System Emails', href: paths.dashboard.systememails.list },
           
            

          
     
          ]
        },
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
            { key: 'paymentapi', title: 'Payment API', href: paths.dashboard.paymentapi.list  },
            { key: 'emailapi', title: 'Email API', href: paths.dashboard.emailapi.list  },
            { key: 'usertype', title: 'User types', href: paths.dashboard.usertype.list  },
            

          
     
          ],
        }
      ]
    }

    
  ],
};
