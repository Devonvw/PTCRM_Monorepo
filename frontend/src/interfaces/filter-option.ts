export default interface IFilterOption {
  id: number;
  title: string;
  key: string;
  selected: any[];
  options: Array<{
    id: number;
    title: string;
    meta: {
      key: string;
    };
  }>;
}
