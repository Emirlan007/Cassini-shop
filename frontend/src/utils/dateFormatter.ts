  export const convertSeconds = (totalSeconds: number) => {
    let remaining = totalSeconds;
    
    const weeks = Math.floor(remaining / (7 * 24 * 60 * 60 * 1000));
    remaining %= 7 * 24 * 60 * 60 * 1000;

    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    remaining %= 24 * 60 * 60 * 1000;

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    remaining %= 60 * 60 * 1000;

    const minutes = Math.floor(remaining / (60 * 1000));
    remaining %= 60 * 1000;

    return { weeks, days, hours, minutes };
  };
