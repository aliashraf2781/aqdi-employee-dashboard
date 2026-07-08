import dollarIcon from "@/public/images/dollarIcon.svg";
import AnalysisMetricCard from "./AnalysisMetricCard";

export default function DayCard({ item }) {
    return <AnalysisMetricCard item={item} icon={dollarIcon} />;
}
