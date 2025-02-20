
let initialState = {
  users: [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'bretgraham',
      email: 'leanne.graham@gmail.com'
    },
    {
      id: 2,
      name: 'Chris Novoselic',
      username: 'chris.novo',
      email: 'novoselic@gmail.com'
    },
    {
      id: 3,
      name: 'Juan Morantes',
      username: 'juansneak',
      email: 'juansneak@gmail.com'
    },
    {
      id: 4,
      name: 'Gustavo Taccetti',
      username: 'gusgus',
      email: 'elgus@gmail.com'
    },
  ]
  
};

function reducer (state = initialState, action) {
  switch (action.type) {
    case 'FETCH_USERS':
      return {
        users: action.payload
      }
    case 'ADD_USER':
      return {
        users: [
          ...state.users,
          {
            id: state.users.length + 1,
            ...action.payload
          }
        ]
      }
    case 'DELETE_USER':
      return {
        users: state.users.filter(user => user.id !== action.payload)
      }
    case 'EDIT_USER':
      return {
        users: state.users.map(user => {
          if (user.id === action.payload.id) {
            return action.payload;
          }
          return user
        })
      }
    default:
      return state
  }
}

export { initialState, reducer };
