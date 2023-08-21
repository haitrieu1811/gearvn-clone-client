import { MegaMenuItem } from 'src/components/MegaMenu/MegaMenu';
import PATH from 'src/constants/path';

export const MENU_DATA: { [key: string]: MegaMenuItem[] } = {
  LAPTOP: [
    {
      heading: 'Thương hiệu',
      data: [
        {
          to: `${PATH.PRODUCT}?brand=64bcdaa7ae38e6a282211273`,
          name: 'ACER'
        },
        {
          to: `${PATH.PRODUCT}?brand=64afcf2d4a921a14beb05916`,
          name: 'ASUS'
        },
        {
          to: PATH.PRODUCT,
          name: 'LENOVO'
        },
        {
          to: PATH.PRODUCT,
          name: 'DELL'
        },
        {
          to: PATH.PRODUCT,
          name: 'LG'
        }
      ]
    },
    {
      heading: 'Giá bán',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Dưới 15 triệu'
        },
        {
          to: PATH.PRODUCT,
          name: 'Từ 15 đến 20 triệu'
        },
        {
          to: PATH.PRODUCT,
          name: 'Trên 20 triệu'
        }
      ]
    },
    {
      heading: 'CPU Intel - AMD',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Intel Core i3'
        },
        {
          to: PATH.PRODUCT,
          name: 'Intel Core i5'
        },
        {
          to: PATH.PRODUCT,
          name: 'Intel Core i7'
        },
        {
          to: PATH.PRODUCT,
          name: 'AMD Ryzen'
        },
        {
          to: PATH.PRODUCT,
          name: 'Intel Gen 13'
        }
      ]
    },
    {
      heading: 'Nhu cầu sử dụng',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Đồ họa - Studio'
        },
        {
          to: PATH.PRODUCT,
          name: 'Học sinh - Sinh viên'
        },
        {
          to: PATH.PRODUCT,
          name: 'Mỏng nhẹ cao cấp'
        },
        {
          to: PATH.PRODUCT,
          name: 'Studio RTX 40 series'
        }
      ]
    },
    {
      heading: 'Linh kiện Laptop',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Ram laptop'
        },
        {
          to: PATH.PRODUCT,
          name: 'SSD laptop'
        },
        {
          to: PATH.PRODUCT,
          name: 'Ổ cứng di động'
        }
      ]
    },
    {
      heading: 'Phụ kiện Laptop',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Balo - Túi chống sốc'
        },
        {
          to: PATH.PRODUCT,
          name: 'Đế tản nhiệt LAPTOP'
        },
        {
          to: PATH.PRODUCT,
          name: 'Ổ cứng di động'
        }
      ]
    },
    {
      heading: 'Laptop ASUS',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'ASUS OLED Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'VivoBook Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'VivoBook Pro Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Zenbook Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'ExpertBook Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'ProArt StudioBook Series'
        }
      ]
    },
    {
      heading: 'Laptop ACER',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Aspire Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Swift Series'
        }
      ]
    },
    {
      heading: 'Laptop MSI',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Modern Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Prestige Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Summit Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'CREATOR Series'
        }
      ]
    },
    {
      heading: 'Laptop LENOVO',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'ThinkBook Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'IdeaPad Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'IdeaPad Pro Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'ThinkPad Series'
        },
        {
          to: PATH.PRODUCT,
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
          to: PATH.PRODUCT,
          name: 'ACER / PREDATOR'
        },
        {
          to: PATH.PRODUCT,
          name: 'ASUS / ROG'
        },
        {
          to: PATH.PRODUCT,
          name: 'MSI'
        },
        {
          to: PATH.PRODUCT,
          name: 'LENOVO'
        },
        {
          to: PATH.PRODUCT,
          name: 'DELL'
        },
        {
          to: PATH.PRODUCT,
          name: 'GIGABYTE / AORUS'
        },
        {
          to: PATH.PRODUCT,
          name: 'HP'
        }
      ]
    },
    {
      heading: 'Giá bán',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Dưới 20 triệu'
        },
        {
          to: PATH.PRODUCT,
          name: 'Từ 20 đến 25 triệu'
        },
        {
          to: PATH.PRODUCT,
          name: 'Từ 25 đến 30 triệu'
        },
        {
          to: PATH.PRODUCT,
          name: 'Dưới 20 triệu'
        },
        {
          to: PATH.PRODUCT,
          name: 'Trên 30 triệu'
        },
        {
          to: PATH.PRODUCT,
          name: 'Gaming cao cấp'
        },
        {
          to: PATH.PRODUCT,
          name: 'Gaming RTX 40 Series'
        }
      ]
    },
    {
      heading: 'ACER | PREDATOR',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Nitro Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Aspire Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Predator Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'ConceptD Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'ACER RTX 40 Series'
        }
      ]
    },
    {
      heading: 'ASUS | ROG Gaming',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'ROG Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'TUF Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Zephyrus Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'ROG Strix G'
        },
        {
          to: PATH.PRODUCT,
          name: 'ROG Flow series'
        },
        {
          to: PATH.PRODUCT,
          name: 'TUF RTX 40 Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'ROG RTX 40 Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'ROG Ally'
        }
      ]
    },
    {
      heading: 'MSI Gaming',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'GF Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'GS Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Bravo Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Creator Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'MSI AMD Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Crosshair Series'
        },
        {
          to: PATH.PRODUCT,
          name: 'MSI RTX 40 Series'
        }
      ]
    },
    {
      heading: 'LENOVO Gaming',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Legion Gaming'
        },
        {
          to: PATH.PRODUCT,
          name: 'Ideapad Gaming'
        },
        {
          to: PATH.PRODUCT,
          name: 'Lenovo RTX 40 Series'
        }
      ]
    },
    {
      heading: 'DELL Gaming',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Dell Gaming G series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Alienware series'
        },
        {
          to: PATH.PRODUCT,
          name: 'Dell RTX 40 Series'
        }
      ]
    },
    {
      heading: 'GIGABYTE Gaming',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'GIGABYTE G5 | G7'
        },
        {
          to: PATH.PRODUCT,
          name: 'GIGABYTE AORUS'
        },
        {
          to: PATH.PRODUCT,
          name: 'GIGABYTE AERO'
        },
        {
          to: PATH.PRODUCT,
          name: 'GIGABYTE RTX 40 Series'
        }
      ]
    },
    {
      heading: 'Card đồ hoạ',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'GTX 1650'
        },
        {
          to: PATH.PRODUCT,
          name: 'RTX 3050 / 3050Ti'
        },
        {
          to: PATH.PRODUCT,
          name: 'RTX 3060'
        },
        {
          to: PATH.PRODUCT,
          name: 'RTX 3070 / 3080'
        },
        {
          to: PATH.PRODUCT,
          name: 'AMD Radeon RX'
        },
        {
          to: PATH.PRODUCT,
          name: 'RTX 40 Series'
        }
      ]
    },
    {
      heading: 'Linh Kiện Laptop',
      data: [
        {
          to: PATH.PRODUCT,
          name: 'Ram laptop'
        },
        {
          to: PATH.PRODUCT,
          name: 'SSD laptop'
        },
        {
          to: PATH.PRODUCT,
          name: 'Ổ cứng di động'
        }
      ]
    }
  ]
};
