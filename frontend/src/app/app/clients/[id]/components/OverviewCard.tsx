import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IProps {
  title: string;
  value: string | number;
  extraInfo?: string;
  icon: React.ReactNode;
}

const OverviewCard = (props: IProps) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{props.title}</CardTitle>
        {props.icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{props.value}</div>
        {props.extraInfo && (
          <p className='text-xs text-muted-foreground'>{props.extraInfo}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
