
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FeedbackEntry {
  id: string;
  category: string;
  rating: number;
  message: string;
  anonymous: boolean;
  submittedDate: string;
  status: 'submitted' | 'reviewed' | 'responded';
}

const FeedbackSystem = () => {
  const { toast } = useToast();
  const [feedbackForm, setFeedbackForm] = useState({
    category: '',
    rating: 0,
    message: '',
    anonymous: false
  });

  const [previousFeedback, setPreviousFeedback] = useState<FeedbackEntry[]>([
    {
      id: 'fb1',
      category: 'Management',
      rating: 4,
      message: 'Great leadership and support from the management team.',
      anonymous: false,
      submittedDate: '2024-06-15',
      status: 'reviewed'
    },
    {
      id: 'fb2',
      category: 'Work Environment',
      rating: 5,
      message: 'Love the collaborative work environment and flexible policies.',
      anonymous: true,
      submittedDate: '2024-05-20',
      status: 'responded'
    }
  ]);

  const categories = [
    'Management',
    'Work Environment', 
    'Compensation & Benefits',
    'Training & Development',
    'Communication',
    'Work-Life Balance',
    'Company Policies',
    'Team Collaboration',
    'General Feedback'
  ];

  const handleSubmitFeedback = () => {
    if (!feedbackForm.category || !feedbackForm.message || feedbackForm.rating === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and provide a rating.",
        variant: "destructive"
      });
      return;
    }

    const newFeedback: FeedbackEntry = {
      id: `fb${previousFeedback.length + 1}`,
      ...feedbackForm,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'submitted'
    };

    setPreviousFeedback([newFeedback, ...previousFeedback]);
    setFeedbackForm({
      category: '',
      rating: 0,
      message: '',
      anonymous: false
    });

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback. It has been sent to HR for review.",
    });
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setFeedbackForm({...feedbackForm, rating: star}) : undefined}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Submit Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <Select
                value={feedbackForm.category}
                onValueChange={(value) => setFeedbackForm({ ...feedbackForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rating *</label>
              {renderStars(feedbackForm.rating, true)}
              <p className="text-xs text-gray-500 mt-1">Click to rate from 1 to 5 stars</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Feedback *</label>
              <Textarea
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                placeholder="Share your thoughts, suggestions, or concerns..."
                rows={5}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={feedbackForm.anonymous}
                onCheckedChange={(checked) => 
                  setFeedbackForm({ ...feedbackForm, anonymous: checked as boolean })
                }
              />
              <label htmlFor="anonymous" className="text-sm">
                Submit anonymously
              </label>
            </div>

            <Button onClick={handleSubmitFeedback} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Previous Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previousFeedback.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No previous feedback submitted</p>
            ) : (
              previousFeedback.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{feedback.category}</h4>
                      {feedback.anonymous && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Anonymous</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(feedback.rating)}
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{feedback.message}</p>
                  
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(feedback.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSystem;
