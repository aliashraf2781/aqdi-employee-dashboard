import orderIcon from "@/public/images/ordericon.svg";
import AnalysisMetricCard from "./AnalysisMetricCard";

export default function LocationsCard({ item }) {
    return (
        <AnalysisMetricCard
            item={item}
            icon={orderIcon}
            showViewButton={false}
        />
    );
}
