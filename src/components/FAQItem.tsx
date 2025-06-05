
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FAQItemProps {
  question: string;
  answer: string;
  category: string;
  isPopular?: boolean;
}

const FAQItem = ({ question, answer, category, isPopular = false }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isPopular ? "default" : "secondary"} className="text-xs">
                {category}
              </Badge>
              {isPopular && (
                <Badge variant="destructive" className="text-xs">
                  Popular
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 pr-4">{question}</h3>
          </div>
          <div className="flex-shrink-0 ml-4">
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </button>
      
      {isOpen && (
        <CardContent className="px-6 pb-6 pt-0">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {answer}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FAQItem;
