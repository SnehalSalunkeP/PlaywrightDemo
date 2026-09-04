export interface EmployeeData {
    firstName: string;
    middleName: string;
    lastName: string;
}

export const employeeData: EmployeeData[] = [

    {
        firstName: 'John',
        middleName: 'Test',
        lastName: 'Automation'
    },

    {
        firstName: 'David',
        middleName: 'QA',
        lastName: 'Tester'
    },

    {
        firstName: 'Sarah',
        middleName: 'Playwright',
        lastName: 'Engineer'
    },

    // {
    //     firstName: 'Michael',
    //     middleName: 'Test',
    //     lastName: 'Developer'
    // }

];

/**
 * Generate unique employee data with timestamp to avoid flaky tests
 * @param baseData Optional base data to extend with unique name
 * @returns Employee data with unique name
 */
export function generateUniqueEmployee(baseData?: Partial<EmployeeData>): EmployeeData {
    // Use current timestamp in a shorter format
    const dateObj = new Date();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    const ms = dateObj.getMilliseconds().toString().padStart(3, '0').slice(0, 2);
    const uniqueId = `${hours}${minutes}${seconds}${ms}`;
    
    return {
        firstName: baseData?.firstName || 'Test',
        middleName: baseData?.middleName || 'User',
        lastName: baseData?.lastName || `QA${uniqueId}`
    };
}