
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Eye, Trash2, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadDate: string;
  downloadUrl?: string;
}

const DocumentsSection = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc1',
      name: 'Offer Letter.pdf',
      type: 'PDF',
      category: 'Employment',
      size: '245 KB',
      uploadDate: '2024-01-15',
      downloadUrl: '#'
    },
    {
      id: 'doc2',
      name: 'ID Proof - Passport.jpg',
      type: 'Image',
      category: 'Identity',
      size: '1.2 MB',
      uploadDate: '2024-01-20',
      downloadUrl: '#'
    },
    {
      id: 'doc3',
      name: 'Experience Certificate.pdf',
      type: 'PDF',
      category: 'Employment',
      size: '180 KB',
      uploadDate: '2024-02-01',
      downloadUrl: '#'
    }
  ]);

  const categories = [
    'Employment',
    'Identity', 
    'Education',
    'Medical',
    'Tax',
    'Other'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDocument: Document = {
        id: `doc${documents.length + 1}`,
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'Image' : 'Document',
        category: 'Other',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        downloadUrl: URL.createObjectURL(file)
      };

      setDocuments([...documents, newDocument]);
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.downloadUrl) {
      const link = document.createElement('a');
      link.href = doc.downloadUrl;
      link.download = doc.name;
      link.click();
      
      toast({
        title: "Download Started",
        description: `Downloading ${doc.name}`,
      });
    }
  };

  const handleDelete = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
    toast({
      title: "Document Deleted",
      description: "Document has been removed successfully.",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Employment': 'bg-blue-100 text-blue-800',
      'Identity': 'bg-green-100 text-green-800',
      'Education': 'bg-purple-100 text-purple-800',
      'Medical': 'bg-red-100 text-red-800',
      'Tax': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          HR Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium">Upload Document</p>
              <p className="text-sm text-gray-600">
                Upload important HR documents (PDF, JPG, PNG, DOC)
              </p>
            </div>
            <div>
              <Input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                id="document-upload"
              />
              <Button asChild>
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Choose File
                </label>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(doc.category)}>
                    {doc.category}
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
