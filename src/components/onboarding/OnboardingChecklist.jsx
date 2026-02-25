import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, Circle, Rocket, Palette, Globe, 
  Phone, ChevronRight, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

const CHECKLIST_ITEMS = [
  {
    id: 'created_project',
    title: 'Create Your First Business Project',
    description: 'Start with market research and business planning',
    icon: Rocket,
    color: 'text-purple-600',
    link: 'CreateBusiness'
  },
  {
    id: 'completed_market_research',
    title: 'Complete Market Research',
    description: 'AI-powered analysis of your industry and competitors',
    icon: Sparkles,
    color: 'text-blue-600',
    link: 'CreateBusiness'
  },
  {
    id: 'generated_logo',
    title: 'Generate Your Brand Logo',
    description: 'Create professional logo and brand identity',
    icon: Palette,
    color: 'text-pink-600',
    link: 'CreateBusiness'
  },
  {
    id: 'created_website',
    title: 'Build Your Website',
    description: 'AI-generated content and professional design',
    icon: Globe,
    color: 'text-emerald-600',
    link: 'CreateBusiness'
  },
  {
    id: 'setup_phone_system',
    title: 'Setup Phone System',
    description: 'Configure AI receptionist and business phone',
    icon: Phone,
    color: 'text-violet-600',
    link: 'PhoneSystem'
  }
];

export default function OnboardingChecklist({ checklist = {}, projects = [] }) {
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-600" />
            Getting Started Checklist
          </CardTitle>
          <Badge variant={progressPercentage === 100 ? 'default' : 'secondary'}>
            {completedCount} / {totalCount}
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2 mt-3" />
      </CardHeader>
      <CardContent className="space-y-3">
        {CHECKLIST_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isCompleted = checklist[item.id];
          const linkPath = item.link === 'CreateBusiness' && projects.length > 0
            ? `${createPageUrl(item.link)}?projectId=${projects[0].id}`
            : createPageUrl(item.link);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={linkPath}>
                <div
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${item.color}`} />
                          <h4 className={`font-semibold ${isCompleted ? 'text-slate-700 line-through' : 'text-slate-900'}`}>
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                    </div>
                    {!isCompleted && (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        {progressPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg text-center text-white mt-4"
          >
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-lg font-bold mb-1">Onboarding Complete! 🎉</h3>
            <p className="text-sm text-emerald-50">
              You're all set to build and grow your business with BrandForge
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}