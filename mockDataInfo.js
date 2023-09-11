const fakeDataArray = [
    { lastName: "Doe", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 123456789 },
    { name: "Jane", lastName: "Smith", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 987654321 },
    { name: "Michael", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 654321987 },
    { name: "Emily", lastName: "Williams", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789456123 },
    { name: "Robert", lastName: "Brown", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789123 },
    { name: "Olivia", lastName: "Jones", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321789456 },
    { name: "William", lastName: "Davis", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456123789 },
    { name: "Sophia", lastName: "Miller", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789123456 },
    { name: "James", lastName: "Wilson", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321456789 },
    { name: "Ava", lastName: "Taylor", gender: "Femenino"},
    { name: "John", lastName: "Anderson", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789321456 },
    { name: "Emma", lastName: "Thomas", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321789456 },
    { name: "Michael", lastName: "Hernandez", gender: "Masculino" },
    { name: "Olivia", lastName: "Martinez", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789654123 },
    { name: "Robert", lastName: "Robinson", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456123987 },
    { name: "Sophia", lastName: "Clark", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321987654 },
    { name: "William", lastName: "White", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789123456 },
    { name: "Ava", lastName: "Lee", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789321 },
    { name: "James", lastName: "Allen", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321456789 },
    { name: "Emily", lastName: "Scott", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789321456 },
    { name: "Michael", lastName: "Young", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 987456321 },
    { name: "Olivia", lastName: "Adams", gender: "Femenino" },
    { name: "Robert", lastName: "Hall", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456123987 },
    { name: "Sophia", lastName: "Allen", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321987654 },
    { name: "William", lastName: "Green", gender: "Masculino" },
    { name: "Ava", lastName: "King", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789321 },
    { name: "Michael", lastName: "Williams", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 123456789 },
    { name: "Sophia", lastName: "Johnson", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 987654321 },
    { name: "James", lastName: "Brown", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 654321987 },
    { name: "Emma", lastName: "Miller", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789456123 },
    { name: "William", lastName: "Jones", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789123 },
    { name: "Ava", lastName: "Davis", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321789456 },
    { name: "John", lastName: "Smith", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456123789 },
    { name: "Olivia", lastName: "Wilson", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789123456 },
    { name: "Michael", lastName: "Taylor", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321456789 },
    { name: "Sophia", lastName: "Lee", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789321 },
    { name: "James", lastName: "Anderson", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789321456 },
    { name: "Emma", lastName: "Thomas", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321789456 },
    { name: "William", lastName: "Hernandez", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 987456321 },
    { name: "Ava", lastName: "Martinez", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789654123 },
    { name: "John", lastName: "Robinson", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456123987 },
    { name: "Olivia", lastName: "Clark", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321987654 },
    { name: "Michael", lastName: "White", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789123456 },
    { name: "Sophia", lastName: "King", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789321 },
    { name: "James", lastName: "Allen", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321456789 },
    { name: "Emma", lastName: "Scott", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789321456 },
    { name: "William", lastName: "Young", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 987456321 },
    { name: "Ava", lastName: "Adams", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789654123 },
    { name: "John", lastName: "Hall", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456123987 },
    { name: "Olivia", lastName: "Allen", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321987654 },
    { name: "Michael", lastName: "Green", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789123456 },
    { name: "Sophia", lastName: "King", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789321 },
    { name: "James", lastName: "Miller", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321456789 },
    { name: "Emma", lastName: "Davis", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789321456 },
    { name: "William", lastName: "Jones", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 987456321 },
    { name: "Ava", lastName: "Robinson", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789654123 },
    { name: "John", lastName: "Clark", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456123987 },
    { name: "Olivia", lastName: "Wilson", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321987654 },
    { name: "Michael", lastName: "Smith", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789123456 },
    { name: "Sophia", lastName: "Taylor", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789321 },
    { name: "James", lastName: "Lee", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321456789 },
    { name: "Emma", lastName: "Anderson", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789321456 },
    { name: "William", lastName: "Thomas", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 987456321 },
    { name: "Ava", lastName: "Hernandez", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789654123 },
    { name: "John", lastName: "Martinez", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456123987 },
    { name: "Olivia", lastName: "Robinson", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321987654 },
    { name: "Michael", lastName: "Clark", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789123456 },
    { name: "Sophia", lastName: "White", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789321 },
    { name: "James", lastName: "King", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321456789 },
    { name: "Emma", lastName: "Allen", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789321456 },
    { name: "William", lastName: "Green", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 987456321 },
    { name: "Ava", lastName: "Miller", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789654123 },
    { name: "John", lastName: "Davis", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456123987 },
    { name: "Olivia", lastName: "Jones", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321987654 },
    { name: "Michael", lastName: "Scott", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789123456 },
    { name: "Sophia", lastName: "Johnson", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 456789321 },
    { name: "James", lastName: "Williams", gender: "Masculino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 321456789 },
    { name: "Emma", lastName: "Brown", gender: "Femenino", date : { local:'9/8/2023' , value:'9/9/2023'}, document: 789321456 },
  ];
  
  async function simulateAPICall(gender, pageNumber, pageSize) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let filteredData = fakeDataArray;
  
    if (gender) {
      filteredData = filteredData.filter((item) => item.gender === gender);
    }
  
    const totalPages = Math.ceil(filteredData.length / pageSize);
  
    if (pageNumber <= 0 || pageNumber > totalPages) {
      return { error: "Página inválida" };
    }
  
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      totalPages: totalPages,
      currentPage: pageNumber,
      data: paginatedData,
    };
  }
  export default simulateAPICall