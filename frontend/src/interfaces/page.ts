export interface IPage {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
