import { MegaMenuItem } from './MegaMenu';
import PATH from 'src/constants/path';

export const MEGA_MENU_DATA: { [key: string]: MegaMenuItem[] } = {
  LAPTOP: [
    {
      heading: 'Thương hiệu',
      data: [
        {
          to: `${PATH.HOME}?brand=64bcdaa7ae38e6a282211273`,
          name: 'ACER'
        },
        {
          to: `${PATH.HOME}?brand=64afcf2d4a921a14beb05916`,
          name: 'ASUS'
        },
        {
          to: PATH.HOME,
          name: 'LENOVO'
        },
        {
          to: PATH.HOME,
          name: 'DELL'
        },
        {
          to: PATH.HOME,
          name: 'LG'
        }
      ]
    },
    {
      heading: 'Giá bán',
      data: [
        {
          to: PATH.HOME,
          name: 'Dưới 15 triệu'
        },
        {
          to: PATH.HOME,
          name: 'Từ 15 đến 20 triệu'
        },
        {
          to: PATH.HOME,
          name: 'Trên 20 triệu'
        }
      ]
    },
    {
      heading: 'CPU Intel - AMD',
      data: [
        {
          to: PATH.HOME,
          name: 'Intel Core i3'
        },
        {
          to: PATH.HOME,
          name: 'Intel Core i5'
        },
        {
          to: PATH.HOME,
          name: 'Intel Core i7'
        },
        {
          to: PATH.HOME,
          name: 'AMD Ryzen'
        },
        {
          to: PATH.HOME,
          name: 'Intel Gen 13'
        }
      ]
    },
    {
      heading: 'Nhu cầu sử dụng',
      data: [
        {
          to: PATH.HOME,
          name: 'Đồ họa - Studio'
        },
        {
          to: PATH.HOME,
          name: 'Học sinh - Sinh viên'
        },
        {
          to: PATH.HOME,
          name: 'Mỏng nhẹ cao cấp'
        },
        {
          to: PATH.HOME,
          name: 'Studio RTX 40 series'
        }
      ]
    },
    {
      heading: 'Linh kiện Laptop',
      data: [
        {
          to: PATH.HOME,
          name: 'Ram laptop'
        },
        {
          to: PATH.HOME,
          name: 'SSD laptop'
        },
        {
          to: PATH.HOME,
          name: 'Ổ cứng di động'
        }
      ]
    },
    {
      heading: 'Phụ kiện Laptop',
      data: [
        {
          to: PATH.HOME,
          name: 'Balo - Túi chống sốc'
        },
        {
          to: PATH.HOME,
          name: 'Đế tản nhiệt LAPTOP'
        },
        {
          to: PATH.HOME,
          name: 'Ổ cứng di động'
        }
      ]
    },
    {
      heading: 'Laptop ASUS',
      data: [
        {
          to: PATH.HOME,
          name: 'ASUS OLED Series'
        },
        {
          to: PATH.HOME,
          name: 'VivoBook Series'
        },
        {
          to: PATH.HOME,
          name: 'VivoBook Pro Series'
        },
        {
          to: PATH.HOME,
          name: 'Zenbook Series'
        },
        {
          to: PATH.HOME,
          name: 'ExpertBook Series'
        },
        {
          to: PATH.HOME,
          name: 'ProArt StudioBook Series'
        }
      ]
    },
    {
      heading: 'Laptop ACER',
      data: [
        {
          to: PATH.HOME,
          name: 'Aspire Series'
        },
        {
          to: PATH.HOME,
          name: 'Swift Series'
        }
      ]
    },
    {
      heading: 'Laptop MSI',
      data: [
        {
          to: PATH.HOME,
          name: 'Modern Series'
        },
        {
          to: PATH.HOME,
          name: 'Prestige Series'
        },
        {
          to: PATH.HOME,
          name: 'Summit Series'
        },
        {
          to: PATH.HOME,
          name: 'CREATOR Series'
        }
      ]
    },
    {
      heading: 'Laptop LENOVO',
      data: [
        {
          to: PATH.HOME,
          name: 'ThinkBook Series'
        },
        {
          to: PATH.HOME,
          name: 'IdeaPad Series'
        },
        {
          to: PATH.HOME,
          name: 'IdeaPad Pro Series'
        },
        {
          to: PATH.HOME,
          name: 'ThinkPad Series'
        },
        {
          to: PATH.HOME,
          name: 'Yoga Series'
        }
      ]
    }
  ],
  PC_GAMING: [
    {
      heading: 'Thương hiệu',
      data: [
        {
          to: PATH.HOME,
          name: 'ACER / PREDATOR'
        },
        {
          to: PATH.HOME,
          name: 'ASUS / ROG'
        },
        {
          to: PATH.HOME,
          name: 'MSI'
        },
        {
          to: PATH.HOME,
          name: 'LENOVO'
        },
        {
          to: PATH.HOME,
          name: 'DELL'
        },
        {
          to: PATH.HOME,
          name: 'GIGABYTE / AORUS'
        },
        {
          to: PATH.HOME,
          name: 'HP'
        }
      ]
    },
    {
      heading: 'Giá bán',
      data: [
        {
          to: PATH.HOME,
          name: 'Dưới 20 triệu'
        },
        {
          to: PATH.HOME,
          name: 'Từ 20 đến 25 triệu'
        },
        {
          to: PATH.HOME,
          name: 'Từ 25 đến 30 triệu'
        },
        {
          to: PATH.HOME,
          name: 'Dưới 20 triệu'
        },
        {
          to: PATH.HOME,
          name: 'Trên 30 triệu'
        },
        {
          to: PATH.HOME,
          name: 'Gaming cao cấp'
        },
        {
          to: PATH.HOME,
          name: 'Gaming RTX 40 Series'
        }
      ]
    },
    {
      heading: 'ACER | PREDATOR',
      data: [
        {
          to: PATH.HOME,
          name: 'Nitro Series'
        },
        {
          to: PATH.HOME,
          name: 'Aspire Series'
        },
        {
          to: PATH.HOME,
          name: 'Predator Series'
        },
        {
          to: PATH.HOME,
          name: 'ConceptD Series'
        },
        {
          to: PATH.HOME,
          name: 'ACER RTX 40 Series'
        }
      ]
    },
    {
      heading: 'ASUS | ROG Gaming',
      data: [
        {
          to: PATH.HOME,
          name: 'ROG Series'
        },
        {
          to: PATH.HOME,
          name: 'TUF Series'
        },
        {
          to: PATH.HOME,
          name: 'Zephyrus Series'
        },
        {
          to: PATH.HOME,
          name: 'ROG Strix G'
        },
        {
          to: PATH.HOME,
          name: 'ROG Flow series'
        },
        {
          to: PATH.HOME,
          name: 'TUF RTX 40 Series'
        },
        {
          to: PATH.HOME,
          name: 'ROG RTX 40 Series'
        },
        {
          to: PATH.HOME,
          name: 'ROG Ally'
        }
      ]
    },
    {
      heading: 'MSI Gaming',
      data: [
        {
          to: PATH.HOME,
          name: 'GF Series'
        },
        {
          to: PATH.HOME,
          name: 'GS Series'
        },
        {
          to: PATH.HOME,
          name: 'Bravo Series'
        },
        {
          to: PATH.HOME,
          name: 'Creator Series'
        },
        {
          to: PATH.HOME,
          name: 'MSI AMD Series'
        },
        {
          to: PATH.HOME,
          name: 'Crosshair Series'
        },
        {
          to: PATH.HOME,
          name: 'MSI RTX 40 Series'
        }
      ]
    },
    {
      heading: 'LENOVO Gaming',
      data: [
        {
          to: PATH.HOME,
          name: 'Legion Gaming'
        },
        {
          to: PATH.HOME,
          name: 'Ideapad Gaming'
        },
        {
          to: PATH.HOME,
          name: 'Lenovo RTX 40 Series'
        }
      ]
    },
    {
      heading: 'DELL Gaming',
      data: [
        {
          to: PATH.HOME,
          name: 'Dell Gaming G series'
        },
        {
          to: PATH.HOME,
          name: 'Alienware series'
        },
        {
          to: PATH.HOME,
          name: 'Dell RTX 40 Series'
        }
      ]
    },
    {
      heading: 'GIGABYTE Gaming',
      data: [
        {
          to: PATH.HOME,
          name: 'GIGABYTE G5 | G7'
        },
        {
          to: PATH.HOME,
          name: 'GIGABYTE AORUS'
        },
        {
          to: PATH.HOME,
          name: 'GIGABYTE AERO'
        },
        {
          to: PATH.HOME,
          name: 'GIGABYTE RTX 40 Series'
        }
      ]
    },
    {
      heading: 'Card đồ hoạ',
      data: [
        {
          to: PATH.HOME,
          name: 'GTX 1650'
        },
        {
          to: PATH.HOME,
          name: 'RTX 3050 / 3050Ti'
        },
        {
          to: PATH.HOME,
          name: 'RTX 3060'
        },
        {
          to: PATH.HOME,
          name: 'RTX 3070 / 3080'
        },
        {
          to: PATH.HOME,
          name: 'AMD Radeon RX'
        },
        {
          to: PATH.HOME,
          name: 'RTX 40 Series'
        }
      ]
    },
    {
      heading: 'Linh Kiện Laptop',
      data: [
        {
          to: PATH.HOME,
          name: 'Ram laptop'
        },
        {
          to: PATH.HOME,
          name: 'SSD laptop'
        },
        {
          to: PATH.HOME,
          name: 'Ổ cứng di động'
        }
      ]
    }
  ]
};
