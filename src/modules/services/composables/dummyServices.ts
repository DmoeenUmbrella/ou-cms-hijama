// Large dummy data for clients for UI development/testing

// Helper to generate dummy clients array without Array.from
function generateDummyServices(count: number) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      id: i + 1,
      name: `Service ${i + 1}`,
      description: i % 3 === 0 ? `Description for service ${i + 1}` : null,
      amount: 10 + (i * 5),
      duration: 30 + (i * 15),
      isDeleted: false,
      createdOn: new Date(Date.now() - i * 86400000).toISOString(),
      modifiedOn: null,
      deletedTime: new Date(Date.now() - i * 86400000).toISOString()
    });
  }
  return arr;
}

export const dummyServicesResponse = {
  isSuccess: true,
  data: generateDummyServices(100),
  message: 'Services Found Successfully..!',
  totalCount: 100
};
