// Large dummy data for users for UI development/testing

// Helper to generate dummy users array
function generateDummyUsers(count: number) {
  const arr = [];
  const types = ['admin', 'user'];
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Tom', 'Amy'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    
    arr.push({
      id: i + 1,
      firstName: `${firstName}${i > 9 ? ' ' + (i + 1) : ''}`,
      lastName: `${lastName}`,
      type: types[i % 2],
      email: `${firstName.toLowerCase()}${i + 1}@clinic.com`,
      phoneNumber: `+971 ${50 + (i % 10)} ${('000' + (i * 111)).slice(-3)} ${('0000' + (i * 1234)).slice(-4)}`,
      keycloakUserId: `keycloak-${i + 1}-uuid`,
      profileUrl: '',
      clinicIds: ['1'],
      isActive: i % 3 !== 0,
      isDeleted: false,
      createdOn: new Date(Date.now() - i * 86400000).toISOString(),
      modifiedOn: new Date(Date.now() - i * 86400000).toISOString(),
      deletedOn: null,
      deletedTime: null
    });
  }
  return arr;
}

export const dummyUsersResponse = {
  isSuccess: true,
  data: generateDummyUsers(50),
  message: 'Users Found Successfully..!',
  totalCount: 50
};
