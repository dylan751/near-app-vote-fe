export interface states {
  description: boolean;
  answer: boolean;
  setting: boolean;
}

export const nextState = (currentState: states) => {
  if (currentState.description === true) {
    return {
      description: false,
      answer: true,
      setting: false,
    };
  } else if (currentState.answer === true) {
    return {
      description: false,
      answer: false,
      setting: true,
    };
  } else return currentState;
};
