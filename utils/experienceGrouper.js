const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const groupExperiences = (experiences) => {
  if (!experiences || !Array.isArray(experiences)) return [];

  // Create a map to group experiences by company
  const groupedMap = experiences.reduce((acc, exp) => {
    const company = exp.company || 'Other';
    
    if (!acc[company]) {
      acc[company] = {
        company,
        companyLogo: exp.company_logo_url,
        positions: []
      };
    }

    acc[company].positions.push({
      title: exp.title || '',
      startMonth: exp.starts_at?.month ? MONTHS[exp.starts_at.month - 1] : '',
      startYear: exp.starts_at?.year || '',
      endMonth: exp.ends_at?.month ? MONTHS[exp.ends_at.month - 1] : 'Present',
      endYear: exp.ends_at?.year || 'Present',
      description: exp.description || ''
    });

    // Sort positions by start date (most recent first)
    acc[company].positions.sort((a, b) => {
      const endA = a.endYear === 'Present' ? 9999 : parseInt(a.endYear);
      const endB = b.endYear === 'Present' ? 9999 : parseInt(b.endYear);
      return endB - endA;
    });

    return acc;
  }, {});

  // Convert map to array and sort by most recent position
  return Object.values(groupedMap).sort((a, b) => {
    const latestA = Math.max(...a.positions.map(p => 
      p.endYear === 'Present' ? 9999 : parseInt(p.endYear)
    ));
    const latestB = Math.max(...b.positions.map(p => 
      p.endYear === 'Present' ? 9999 : parseInt(p.endYear)
    ));
    return latestB - latestA;
  });
}; 