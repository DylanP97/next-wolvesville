
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchUsers = async () => {
  try {
    const response = await fetch(
      API_URL + "/api/user/getAllUsers"
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
      API_URL + "/api/roles"
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
      API_URL + "/api/teams"
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
      API_URL + `/api/teams/${name}`
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

export const fetchLogout = async (username, isGuest) => {
  try {
    return await fetch(API_URL + "/api/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Add this header
      },
      credentials: "include",
      body: JSON.stringify({ username, isGuest }),
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const fetchLogin = async (email, password) => {
  try {
    const response = await fetch(
      API_URL + "/api/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.error) {
        if (data.error.includes("No account") || data.error.includes("no user found")) {
          return { error: "noAccountFound", field: "email" };
        }
        if (data.error.includes("ncorrect password")) {
          return { error: "incorrectPassword", field: "password" };
        }
        return { error: "loginFailed" };
      }

      return { error: "loginFailed" };
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { error: "serverUnavailable" };
  }
};

export const fetchGuestLogin = async (username) => {
  try {
    const response = await fetch(
      API_URL + "/api/user/guestLogin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Guest login failed" };
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Unable to connect to server" };
  }
};

export const fetchSignUp = async (username, email, password, defaultAvatar) => {
  try {
    const response = await fetch(
      API_URL + "/api/user/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, defaultAvatar }),
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle errors object from signUpErrors middleware
      if (data.errors && typeof data.errors === 'object') {
        if (data.errors.password) return { error: "passwordWeak", field: "password" };
        if (data.errors.email) return { error: "emailTaken", field: "email" };
        return { error: "signupFailed" };
      }

      // Handle message from controller validation
      if (data.message) {
        if (data.message.includes("Username Already Exists")) {
          return { error: "usernameTaken", field: "username" };
        }
        if (data.message.includes("Email Already Exists")) {
          return { error: "emailTaken", field: "email" };
        }
        if (data.message.includes("Username")) {
          return { error: "usernameRequired", field: "username" };
        }
        if (data.message.includes("Email")) {
          return { error: "emailRequired", field: "email" };
        }
        if (data.message.includes("Password")) {
          return { error: "passwordRequired", field: "password" };
        }
        return { error: "signupFailed" };
      }

      return { error: "signupFailed" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "serverUnavailable" };
  }
};