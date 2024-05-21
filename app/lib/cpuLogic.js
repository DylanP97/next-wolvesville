const cpuLogic = (cpuId, cpuName, cpuRole, timeOfTheDay) => {
  if (timeOfTheDay == "nighttime" && cpuRole == "Classic Werewolf") {
    console.log(cpuId, " ", cpuName);
  }
};

export default cpuLogic;
