const fetchTeams = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/teams"
    );
    if (response.ok) {
      return teamsData = await response.json();
    } else {
      console.error("Failed to fetch teams");
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
};

export default fetchTeams;
