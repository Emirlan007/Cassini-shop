import { BadRequestException } from '@nestjs/common';

export const getYesterdayRange = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    fromDate: getStartOfDay(yesterday),
    toDate: getEndOfDay(yesterday),
  };
};

export const getStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

export const getEndOfDay = (date: Date) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

export const getRangeByPeriod = (
  period: 'day' | 'week' | 'month' | 'year' | 'all',
) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  switch (period) {
    case 'day':
      return {
        fromDate: getStartOfDay(yesterday),
        toDate: getEndOfDay(yesterday),
      };

    case 'week': {
      const day = yesterday.getDay();
      const diff = day === 0 ? -6 : 1 - day;

      const monday = new Date(yesterday);
      monday.setDate(yesterday.getDate() + diff);

      return {
        fromDate: getStartOfDay(monday),
        toDate: getEndOfDay(yesterday),
      };
    }

    case 'month': {
      const fromDate = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );

      return {
        fromDate,
        toDate: getEndOfDay(yesterday),
      };
    }

    case 'year': {
      const fromDate = new Date(yesterday.getFullYear(), 0, 1, 0, 0, 0, 0);

      return {
        fromDate,
        toDate: getEndOfDay(yesterday),
      };
    }

    case 'all': {
      const fromDate = new Date(0);

      return {
        fromDate,
        toDate: getEndOfDay(yesterday),
      };
    }

    default:
      throw new BadRequestException('Invalid period');
  }
};
