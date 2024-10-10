const docsContent = `
  <p>You are given two integer arrays <b>nums1</b> and <b>nums2</b>, sorted in non-decreasing order, and two integers <b>m</b> and <b>n</b>, representing the number of elements in nums1 and nums2 respectively.</p><br/>
  <p><b>Merge</b> <span class="border border-gray-200 p-1 bg-gray-100 rounded">nums1</span> and  <span class="border border-gray-200 p-1 bg-gray-100 rounded">nums2</span>  into a single array sorted in non-decreasing order.</p><br/>
  <p>The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of <b>m + n</b>, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.</p>
`;

export const repo = [
  {
    id: "repo1",
    objDetails: {
      name: "repo1",
      time: "12:00 PM",
      date: "2024-09-01",
      totalBranches: "",
      url: "https://daisyui.com/components/dropdown/",
      documentation: "",
      image: "https://placehold.co/800x150",
      video: "https://vjs.zencdn.net/v/oceans.mp4",
    },
    access: [
      {
        id: "accessRepo1",
        user: "John Doe",
        permission: ["Initial commit", "Develop"],
      },
      {
        id: "accessRepo2",
        user: "Smith",
        permission: ["Initial commit", "Maintain"],
      },
    ],
    branches: [
      {
        id: "branch1",
        name: "main",
        branchOwner: "John",
        lastCommited: "",
        createdOn: "2024-05-20",
        commits: [
          {
            commitId: "commit1",
            commitMessage: "Initial commit",
            user: "User1",
            commitTime: "10:00",
            commitDate: "2024-08-25",
            changes: [
              {
                fileName: "file1",
                changeType: "added",
                code: "+console.log('Hello world');",
              },
            ],
            access: [
              {
                id: "accessCommit1",
                user: "John Doe",
                permission: ["Initial commit on master", "Develop"],
              },
            ],
          },
          {
            commitId: "commit2",
            commitMessage: "Updated README",
            user: "User2",
            commitTime: "02:00",
            commitDate: "2024-06-30",

            changes: [
              {
                fileName: "README.md",
                changeType: "modified",
                code: "+Added project description",
              },
            ],
            access: [
              {
                id: "accessCommit2",
                user: "John Doe",
                permission: ["Initial commit on master", "Develop"],
              },
            ],
          },
        ],
        access: [
          {
            id: "access1",
            user: "John Doe",
            permission: ["Initial commit", "Develop"],
          },
          {
            id: "access2",
            user: "Smith",
            permission: ["Initial commit", "Maintain"],
          },
        ],
      },
      {
        id: "branch2",
        name: "master",
        branchOwner: "Def",
        lastCommited: "3hrs ago",
        createdOn: "2024-09-20",
        commits: [
          {
            commitId: "commit3",
            commitMessage: "Initial commit on master",
            user: "User3",
            commitTime: "02:00",
            commitDate: "2024-08-30",
            changes: [
              {
                fileName: "index.html",
                changeType: "added",
                code: "+<html><body>Hello world</body></html>",
              },
            ],
            access: [
              {
                id: "accessCommit3",
                user: "John Doe",
                permission: ["Initial commit on master", "Develop"],
              },
            ],
          },
        ],
        access: [
          {
            id: "access4",
            user: "commit3",
            permission: ["Initial commit on master", "tags"],
          },
        ],
      },
    ],
  },
  {
    id: "repo2",

    objDetails: {
      name: "repo2",
      time: "1:00 PM",
      date: "2024-20-01",
      totalBranches: "",
      url: "https://daisyui.com/components/dropdown/",
      image: "https://placehold.co/600x400",
      documentation: "",
    },
    access: [
      {
        id: "access1",
        user: "Smith",
        permission: ["Initial commit", "Maintain"],
      },
    ],
    branches: [
      {
        id: "branch3",
        name: "main",
        branchOwner: "John Doe",
        lastCommited: "",
        createdOn: "2024-03-20",
        commits: [
          {
            commitId: "commit1",
            commitMessage: "Initial commit",
            user: "User1",
            commitTime: "02:00",
            commitDate: "2024-05-22",
            changes: [
              {
                fileName: "file1.js",
                changeType: "added",
                code: "+console.log('Hello world');",
              },
            ],
            access: [
              {
                id: "accessCommit4",
                user: "John Doe",
                permission: ["Initial commit on master", "Develop"],
              },
            ],
          },
          {
            commitId: "commit2",
            commitMessage: "Updated README",
            user: "User2",
            commitTime: "02:00",
            commitDate: "2024-04-21",
            changes: [
              {
                fileName: "README.md",
                changeType: "modified",
                code: "+Added project description",
              },
            ],
            access: [
              {
                id: "accessCommit5",
                user: "John Doe",
                permission: ["Initial commit on master", "Develop"],
              },
            ],
          },
        ],
        access: [
          {
            id: "access6",
            user: "commit3",
            permission: ["Initial commit on master", "tags"],
          },
        ],
      },
    ],
  },
];

export const users = [
  {
    id: "user1", // Unique identifier for the user
    objDetails: {
      firstName:"John",
      lastName:"Doe",
      gender:"Male",
      dob:"1990-01-01",
      maritalStatus:"Single",
      nationality:"Indian",
      image: "https://placehold.co/800x150",
    },
    contacts: [
      {
        id: "contact1",
        type: "primary",
        phoneNumber: "+91 9876543210",
        email: "john.doe@example.com",
      },
      {
        id: "contact2",
        type: "secondary",
        phoneNumber: "+91 9876543221",
        email: "john.doe.secondary@example.com",
      },
      {
        id: "contact3",
        type: "emergency",
        name: "Jane Doe",
        relationship: "Sister",
        phoneNumber: "+91 9876543232",
      },
    ],
    relativeContacts: [
      {
        id: "relativeContact1",
        name: "Jane Doe",
        relationship: "Sister",
        phoneNumber: "+91 9876543232",
      },
      {
        id: "relativeContact2",
        name: "Mark Doe",
        relationship: "Father",
        phoneNumber: "+91 9876543243",
      },
    ],
    documents: [
      {
        id: 1,
        type: "pancard",
        number: "ABCDE1234F",
        fileUrl: "https://example.com/pancard.pdf",
      },
      {
        id: 2,
        type: "aadharcard",
        number: "1234 5678 9012",
        fileUrl: "https://example.com/aadharcard.pdf",
      },
      {
        id: 3,
        type: "passport",
        number: "N1234567",
        fileUrl: "https://example.com/passport.pdf",
      },
    ],
    addresses: [
        {
          id: 1,
          type: "permanent",
          line1: "123, ABC Street",
          line2: "Near XYZ Park",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "India",
        },
      {
        id: 2,
        type: "correspondence",
        line1: "789, PQR Avenue",
        line2: "Opposite LMN Mall",
        city: "Delhi",
        state: "Delhi",
        postalCode: "110001",
        country: "India",
      },
    ],
    occupationDetails: [
      { id: 1, field: "occupation", value: "Software Developer" },
      { id: 2, field: "company", value: "Tech Corp" },
      { id: 3, field: "jobTitle", value: "Senior Developer" },
      { id: 4, field: "dateOfJoining", value: "2015-06-01" },
      { id: 5, field: "employeeId", value: "EMP12345" },
    ],
    bankDetails: [
      { id: 1, field: "accountNumber", value: "123456789012" },
      { id: 2, field: "ifscCode", value: "BANK1234567" },
      { id: 3, field: "bankName", value: "State Bank of India" },
      { id: 4, field: "branch", value: "MG Road, Bangalore" },
    ],
    additionalInfo: [
      { id: 1, field: "hobbies", value: ["Reading", "Cycling", "Gaming"] },
      {
        id: 2,
        field: "languagesSpoken",
        value: ["English", "Hindi", "Marathi"],
      },
    ],
  },
  {
    id: "user2", // Unique identifier for the user
    objDetails: {
      firstName:"Smith",
      lastName:"Doe",
      gender:"Male",
      dob:"1990-01-01",
      maritalStatus:"Single",
      nationality:"Indian",
      image: "https://placehold.co/800x150",
    },
    contacts: [
      {
        id: "contact4",
        type: "primary",
        phoneNumber: "+91 9876543210",
        email: "john.doe@example.com",
      },
   
    ],
    relativeContacts: [
      {
        id: "relativeContact4",
        name: "Jane Doe",
        relationship: "Sister",
        phoneNumber: "+91 9876543232",
      },
     
    ],
    documents: [
      {
        id: 1,
        type: "pancard",
        number: "ABCDE1234F",
        fileUrl: "https://example.com/pancard.pdf",
      },
      {
        id: 2,
        type: "aadharcard",
        number: "1234 5678 9012",
        fileUrl: "https://example.com/aadharcard.pdf",
      },
    
    ],
    addresses: [
      {
        id: 1,
        type: "permanent",
        line1: "123, ABC Street",
        line2: "Near XYZ Park",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
      },

    ],
    occupationDetails: [
      { id: 1, field: "occupation", value: "Software Developer" },
      { id: 2, field: "company", value: "Tech Corp" },
      { id: 3, field: "jobTitle", value: "Senior Developer" },
      { id: 4, field: "dateOfJoining", value: "2015-06-01" },
      { id: 5, field: "employeeId", value: "EMP12345" },
    ],
    bankDetails: [
      { id: 1, field: "accountNumber", value: "123456789012" },
      { id: 2, field: "ifscCode", value: "BANK1234567" },
      { id: 3, field: "bankName", value: "State Bank of India" },
      { id: 4, field: "branch", value: "MG Road, Bangalore" },
    ],
    additionalInfo: [
      { id: 1, field: "hobbies", value: ["Reading", "Cycling", "Gaming"] },
      {
        id: 2,
        field: "languagesSpoken",
        value: ["English", "Hindi", "Marathi"],
      },
    ],
  },
];





