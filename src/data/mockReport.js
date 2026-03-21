export const MOCK_REPORT = {
    id: 'weekly-17',
    title: '',
    date: 'March 18, 2026',
    prepared_by: 'Community & Property Management',
    status: 'published',
    executive_summary: "This report outlines Falcon Island’s operational and financial position during the handover phase.",
    key_concerns: [
        { category: 'Civil', concern: 'Handover issues including civil scratches and paint issues.', priority: 'Medium' },
        { category: 'Privacy', concern: 'Privacy concerns with standardized landscaping packages in progress.', priority: 'Medium' },
        { category: 'Garage Options', concern: 'Townhouse garage door option on hold.', priority: 'Low' }
    ],
    opportunities: [
        { category: 'Community Engagement', opportunity: 'Launch seasonal BBQ events at the new park shades.', impact: 'High' }
    ],
    kpis: {
        villas_handed_over: 47,
        owners_did_not_sign: 6,
        owners_did_not_show: 2,
        total_offered: 159,
        letters_dispatched: 127,
        paid_soas: 65,
    },
    finance: {
        potential: 14600000,
        realized: 7040000,
        upgrade_budget: 305000,
    },
    finance_chart_data: [
        { name: 'Revenue Tracking (AED)', potential: 14600000, realized: 7040000 },
    ],
    upgrade_projects: [
        { id: 1, title: 'Beach lights', status: 'In Progress', owner: 'FM Team', date: 'TBD', cost: 45000 },
        { id: 2, title: 'Barbecue', status: 'Pending', owner: 'FM Team', date: 'TBD', cost: 30000 },
        { id: 3, title: 'Volleyball', status: 'Pending', owner: 'FM Team', date: 'TBD', cost: 25000 },
        { id: 4, title: 'Park shades', status: 'Completed', owner: 'Contractor', date: 'Mar 15', cost: 80000 },
        { id: 5, title: 'Pool shower', status: 'In Progress', owner: 'FM Team', date: 'Mar 25', cost: 15000 },
        { id: 6, title: 'Bridge boat access', status: 'Design', owner: 'Consultant', date: 'Apr 10', cost: 60000 },
        { id: 7, title: 'Gym door', status: 'In Progress', owner: 'Maintenance', date: 'Mar 20', cost: 10000 },
        { id: 8, title: 'Gym wallpaper', status: 'Completed', owner: 'Interior Team', date: 'Mar 12', cost: 15000 },
        { id: 9, title: 'TC2 bathroom shower', status: 'Pending Approval', owner: 'Contractor', date: 'TBD', cost: 25000 },
    ],
    purchase_orders: [
        { id: 1, item: 'USB and key chains decor for handover', procurementStatus: 'Additional samples requested being arranged', closingStatus: 'Sample to be shortlisted', vendor: '', totalValue: '', pr: 'No PR', po: '', buyer: 'Rosalyn' },
        { id: 2, item: 'deep cleaning', procurementStatus: 'PO Issued', closingStatus: 'PO Issued', vendor: 'Inotec', totalValue: 'AED 36,170.00', pr: '5000007279', po: '4900026357', buyer: 'Tanvir' },
        { id: 3, item: 'handover venue tent/shade structure', procurementStatus: 'Proposals shared for review', closingStatus: 'To be finalised', vendor: 'Omer Tent', totalValue: 'TBD', pr: '10021200', po: 'TBD', buyer: 'Durgesh' },
        { id: 4, item: 'flags, robon, red car pet etc', procurementStatus: 'Initial proposals sent', closingStatus: 'To be finalised', vendor: '', totalValue: 'TBD', pr: '10021200', po: 'TBD', buyer: 'Rosalyn' },
        { id: 5, item: 'catering (temp decentralized)', procurementStatus: 'PR Awaited until 31st Jan', closingStatus: 'Vendor finalised', vendor: 'Bake Al Arab', totalValue: 'AED 106.20/Pax', pr: 'Awaited', po: 'TBC', buyer: 'Rosalyn' },
        { id: 6, item: 'Selfie frame', procurementStatus: 'Quote shared, PR awaited', closingStatus: 'Quote from Media Mate Shared', vendor: '', totalValue: '', pr: 'Not received', po: 'TBC', buyer: 'Rosalyn' },
        { id: 7, item: 'landscaping pots (South bridge)', procurementStatus: 'PO Issued', closingStatus: 'PO Issued', vendor: 'Plant Scapre', totalValue: 'AED 16,677.00', pr: '10021185', po: '4500008445', buyer: 'Tanvir' },
        { id: 8, item: 'Landscaping plants', procurementStatus: 'Scope awaited', closingStatus: 'Yet to receive the request/PR', vendor: '', totalValue: '', pr: 'Not received', po: '', buyer: 'Tanvir' }
    ],
    map_settings: {
        isActive: true,
        mapTitle: 'Interactive Community Map',
        baseImageUrl: '/master-plan-villas.jpg',
        imageWidth: 1200,
        imageHeight: 800
    },
    map_points: [
        { id: 'm1', type: 'project', title: 'Beach lights', linkedItemId: 1, xPercent: 42, yPercent: 8 },
        { id: 'm2', type: 'project', title: 'Barbecue', linkedItemId: 2, xPercent: 50, yPercent: 9 },
        { id: 'm3', type: 'project', title: 'Volleyball', linkedItemId: 3, xPercent: 63, yPercent: 7 },
        { id: 'm4', type: 'project', title: 'Park shade', linkedItemId: 4, xPercent: 48, yPercent: 28 },
        { id: 'm5', type: 'project', title: 'Pool shower', linkedItemId: 5, xPercent: 47, yPercent: 44 },
        { id: 'm6', type: 'project', title: 'Park shade', linkedItemId: 4, xPercent: 80, yPercent: 80 },
        { id: 'm7', type: 'project', title: 'Park shade', linkedItemId: 4, xPercent: 66, yPercent: 73 },
        { id: 'm8', type: 'project', title: 'Park shade', linkedItemId: 4, xPercent: 55, yPercent: 72 },
        { id: 'm9', type: 'project', title: 'Bridge boat access', linkedItemId: 6, xPercent: 56, yPercent: 88 },
        { id: 'm10', type: 'project', title: 'Park shade', linkedItemId: 4, xPercent: 42, yPercent: 77 },
        { id: 'm11', type: 'project', title: 'Pool shower', linkedItemId: 5, xPercent: 32, yPercent: 73 },
        { id: 'm12', type: 'project', title: 'Gym door', linkedItemId: 7, xPercent: 57, yPercent: 65 },
        { id: 'm13', type: 'project', title: 'Gym wallpaper', linkedItemId: 8, xPercent: 60, yPercent: 67 },
    ],
    map_areas: [],
    readiness_setup: [
        { topic: 'Construction observations', status: 'Action Required', notes: 'Includes wall dampness, scratches, cleanness, rust on kitchen hoods.' },
        { topic: 'Handover issues', status: 'Ongoing', notes: 'Includes civil scratches and paint issues.' },
        { topic: 'Street signage', status: 'Completed', notes: 'Vertical signage completed. Other street signage pending.' },
        { topic: 'Privacy concerns', status: 'In Progress', notes: 'Standardized landscaping packages in progress.' },
        { topic: 'Townhouse garage door', status: 'Pending', notes: 'Option on hold pending final review.' },
        { topic: 'Owner villa readiness', status: 'In Progress', notes: 'Final cleaning rounds scheduled.' },
        { topic: 'Internet connectivity', status: 'Resolved', notes: 'Issue tracked, most connections live.' },
        { topic: 'FEWA registration process', status: 'Ongoing', notes: 'Coordination with residents for fast track.' },
        { topic: 'Handover arrangements', status: 'Ready', notes: 'Decoration, club carts, gift boxes, landscaping pots all setup.' },
    ],
    ehs_compliance: [
        { topic: 'EHS and compliance items', status: 'Adequate', notes: 'Routine checks conducted daily.' },
        { topic: 'Waste process', status: 'Active', notes: 'Central collection established.' },
    ],
    common_areas: [
        { topic: 'Common area proposals', status: 'Pending', notes: 'Management evaluating new amenity proposals.' },
        { topic: 'Spare load issue', status: 'Under Review', notes: 'Assessing extra capacity.' },
        { topic: 'Pools', status: 'Operational', notes: 'Pools opened and maintained.' },
        { topic: 'Gym', status: 'Operational', notes: 'Gym opened.' },
        { topic: 'Beach cleaning issue', status: 'Action Required', notes: 'Debris reported after storm.' },
        { topic: 'Roads and signage', status: 'Complete', notes: 'Final sign-off completed for roads.' },
        { topic: 'Portal issues', status: 'Resolved', notes: 'App portal stability improved.' },
    ],
    legal: [
        { topic: 'Legal affairs', status: 'Ongoing', notes: 'Reviewing non-standard handover clauses.' },
    ],
    attachments: [
        { id: 1, filename: 'Site_Photos.pdf', size: '4.2 MB' },
        { id: 2, filename: 'Finance_Ledger_Extract.xlsx', size: '1.1 MB' }
    ]
};
