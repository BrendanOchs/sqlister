export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    createdDate: string;
    birthday: string;
}

export interface PersonAge {
    person: string;
    age: number
}

export interface DistinctAges {
    labels: string[],
    ageOccurances: number[]
}