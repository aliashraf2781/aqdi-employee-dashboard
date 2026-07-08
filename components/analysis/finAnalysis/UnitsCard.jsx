import unitsIcon from "@/public/images/unitsicon.svg";
import AnalysisMetricCard from "./AnalysisMetricCard";

export default function UnitsCard({ item }) {
    return <AnalysisMetricCard item={item} icon={unitsIcon} />;
}
