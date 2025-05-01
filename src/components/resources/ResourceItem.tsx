// components/resources/ResourceItem.tsx
import { Resource } from "@/types/resource";

interface ResourceItemProps {
  resource: Resource;
  onEdit?: (id: string, updates: Partial<Resource>) => void;
  onDelete?: (id: string) => void;
}

const ResourceItem = ({ resource }: ResourceItemProps) => {
  return (
    <li className="resource-item">
      <h2>{resource.resourceName}</h2>
      <p>{resource.resourceLink}</p>
      <p>{resource.division}</p>
    </li>
  );
};

export default ResourceItem;