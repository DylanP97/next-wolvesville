export const fetchUsers = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/getAllUsers"
    );
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const fetchRoles = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/roles"
    );
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
};

export const fetchTeams = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/teams"
    );
    if (response.ok) {
      return response.json();
    } else {
      console.error("Failed to fetch teams");
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
};

export const fetchTeamByName = async (name) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/teams/${name}`
    );
    if (response.ok) {
      return response.json();
    } else {
      console.error("Failed to fetch the team");
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
};

export const fetchLogout = async () => {
  try {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/logout", {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const fetchLogin = async (email, password) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      }
    );
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const fetchGuestLogin = async () => {
  console.log("fetchGuestLogin called");  
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/guestLogin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const fetchSignUp = async (username, email, password, defaultAvatar) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, defaultAvatar }),
        credentials: "include",
      }
    );
    console.log("Signup response:", response);
    return response.ok;
  } catch (error) {
    console.error("Signup error:", error);
  }
};
