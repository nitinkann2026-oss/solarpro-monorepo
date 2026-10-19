import heroSolar from '../assets/hero-solar.jpg'
import commercialSolar from '../assets/commercial-solar.jpg'
import industrialSolar from '../assets/industrial-solar.jpg'

export const projectsData = [
  {
    id: 'proj-1',
    title: 'Contemporary Residential Villa Array',
    category: 'Residential',
    capacity: '9.6 kWp System',
    location: 'Demonstration Specimen — Suburban Villa',
    image: heroSolar,
    description:
      'High-efficiency monocrystalline rooftop installation tailored for a multi-story family residence with integrated lithium storage readiness.',
    stats: {
      modules: '24 Tier-1 Panels',
      inverter: 'Hybrid 10kW Smart Inverter',
      estimatedDailyYield: '38 - 44 kWh (sunny conditions)'
    },
    isDemo: true
  },
  {
    id: 'proj-2',
    title: 'Enterprise Corporate Logistics Hub',
    category: 'Commercial',
    capacity: '180 kWp Commercial Roof',
    location: 'Demonstration Specimen — Commercial Park',
    image: commercialSolar,
    description:
      'High-capacity rooftop array designed to offset heavy daytime air conditioning and corporate server load during peak tariff windows.',
    stats: {
      modules: '450 Commercial Panels',
      inverter: 'Dual 90kW Three-Phase Inverters',
      estimatedDailyYield: '720 - 810 kWh (sunny conditions)'
    },
    isDemo: true
  },
  {
    id: 'proj-3',
    title: 'Manufacturing & Distribution Campus',
    category: 'Industrial',
    capacity: '520 kWp Hybrid Ground & Roof',
    location: 'Demonstration Specimen — Industrial Zone',
    image: industrialSolar,
    description:
      'Engineered large-footprint installation combining warehouse rooftop coverage with adjacent ground-mount arrays for high-drain factory machinery.',
    stats: {
      modules: '1,280 High-Capacity Modules',
      inverter: 'Central Utility Inverter Station',
      estimatedDailyYield: '2,080 - 2,340 kWh (sunny conditions)'
    },
    isDemo: true
  }
]
