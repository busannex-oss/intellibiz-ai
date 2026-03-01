import React, { useState } from 'react';
import '@/components/styles/frontend.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import {
  Zap as LogoIcon,
  FileBarChart,
  Wand2,
  Globe2,
  Megaphone,
  Headphones,
  Mail,
  ChevronRight,
  Rocket,
  Zap,
  Shield,
  ArrowRight,
  Radar,
  Target,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Loader2 } from
'lucide-react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const features = [
{
  icon: Radar,
  title: 'Market Research',
  description: 'AI analyzes competitors, market gaps, and opportunities to position you for success',
  color: 'from-cyan-500 to-blue-500'
},
{
  icon: FileBarChart,
  title: 'Strategic Business Plan',
  description: 'Competition-beating plans that exploit competitor weaknesses',
  color: 'from-violet-500 to-purple-500'
},
{
  icon: Wand2,
  title: 'Differentiated Brand',
  description: 'Logos and colors strategically designed to stand out from competitors',
  color: 'from-pink-500 to-rose-500'
},
{
  icon: Globe2,
  title: 'Conversion Website',
  description: 'SEO-optimized content targeting keywords your competitors miss',
  color: 'from-blue-500 to-cyan-500'
},
{
  icon: Megaphone,
  title: 'Social Media',
  description: 'Branded assets designed to capture market attention',
  color: 'from-orange-500 to-amber-500'
},
{
  icon: Headphones,
  title: 'Business Resources',
  description: 'AI phone services and directories for rapid market presence',
  color: 'from-emerald-500 to-green-500'
}];


export default function Home() {
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80&auto=format&fit=crop');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    const loadHeroImage = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          setIsLoggedIn(false);
          return;
        }
        setIsLoggedIn(true);

        const projects = await base44.entities.BusinessProject.filter({
          created_by: user.email
        });

        const project = projects?.[0];
        if (project?.logo_url) {
          setHeroImage(project.logo_url);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    loadHeroImage();
  }, []);

  const generateTargetedHeroImage = async () => {
    setIsGeneratingImage(true);
    try {
      const user = await base44.auth.me();
      if (!user) return;

      const projects = await base44.entities.BusinessProject.filter({
        created_by: user.email
      });

      const project = projects?.[0];
      if (!project) return;

      const prompt = `Create a professional, modern hero image for a financial education platform landing page featuring:
      - A woman aged 30-40 with diverse background (could be African American, Latina, Asian, or Middle Eastern)
      - Casual professional attire, in a modern home office or warm coffee shop setting
      - Appears confident, thoughtful, and hopeful about her financial future
      - May be holding a laptop, tablet, or notebook
      - Warm, accessible, empowering setting - not corporate or intimidating
      - Modern, minimalist aesthetic with warm, inviting lighting
      - Convey: financial empowerment, dignity, hope, entrepreneurship, accessible financial education
      - Shows someone who has overcome financial struggles and is building wealth
      - Professional quality, high conversion potential for underserved financial education demographic`;

      const response = await base44.integrations.Core.GenerateImage({
        prompt
      });

      if (response?.url) {
        setHeroImage(response.url);
        // Save to project
        await base44.entities.BusinessProject.update(project.id, {
          logo_url: response.url
        });
      }
    } catch (error) {
      console.error('Failed to generate hero image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

   return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
                <Zap className="w-4 h-4" />
                AI-Powered Business Builder — Desktop · Mobile · iPad
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-[-0.03em]">
                Build a Brand That
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent"> Outperforms </span>
                Competitors
              </h1>
              
              <p className="text-lg text-slate-400 mb-4 max-w-xl leading-[1.7] tracking-[-0.011em] font-medium">
                AI-powered market research analyzes your competition, finds gaps, and builds 
                a complete brand strategically designed to win market share.
              </p>
              <p className="text-base text-slate-500 mb-10 max-w-lg leading-relaxed">
                Fully cross-platform — optimized for <span className="text-slate-300 font-semibold">desktop</span>, <span className="text-slate-300 font-semibold">smartphone</span>, and <span className="text-slate-300 font-semibold">iPad</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('Onboarding')}>
                  <Button className="h-14 px-8 text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xl shadow-amber-500/25 transition-all duration-300 hover:scale-105 font-semibold">
                    <Rocket className="w-5 h-5 mr-2" />
                    Create Now
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Dashboard')}>
                  <Button variant="outline" className="h-14 px-8 text-base border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm font-semibold">
                    View My Projects
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Hero Image */}
             <motion.div
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.7, delay: 0.2 }}
               className="relative">
               <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-slate-700/50">
                 {isGeneratingImage && (
                   <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                     <div className="flex flex-col items-center gap-3">
                       <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                       <p className="text-white text-sm">Optimizing for US market...</p>
                     </div>
                   </div>
                 )}
                 <img
                   src={heroImage}
                   alt="Ambitious entrepreneur building their brand with AI-powered tools"
                   className="w-full h-[420px] object-cover"
                 />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-amber-500/10" />
                {/* Floating badge with optimize button */}
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">AI builds your entire brand</div>
                      <div className="text-slate-400 text-xs">Logo · Website · Social Media · Business Plan</div>
                    </div>
                  </div>
                  {isLoggedIn && (
                    <Button
                      onClick={generateTargetedHeroImage}
                      disabled={isGeneratingImage}
                      size="sm"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs"
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Generate Hero Image
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-3xl blur-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.02em]">
            Everything You Need to Launch
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-[1.6] tracking-[-0.011em]">
            From business planning to marketing—we've got you covered
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {features.map((feature, index) =>
           <motion.div
             key={feature.title}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: index * 0.1 }}>

               <Card className="group border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm h-full overflow-hidden hover:border-slate-600 transition-all duration-300">
                 <CardContent className="p-8">
                   <div className="mb-5">
                     <feature.icon className={`w-8 h-8 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`} />
                   </div>
                   <h3 className="text-xl font-semibold text-white mb-3 tracking-[-0.02em] break-words">{feature.title}</h3>
                   <p className="text-slate-400 leading-[1.6] tracking-[-0.011em] break-words">{feature.description}</p>
                 </CardContent>
               </Card>
             </motion.div>
           )}
         </div>
      </div>

      {/* Process */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.02em]">How It Works</h2>
            <p className="text-lg text-slate-400 leading-[1.6] tracking-[-0.011em]">Four simple steps to your complete business</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
            { step: '01', title: 'Describe Your Idea', desc: 'Tell us about your business' },
            { step: '02', title: 'AI Researches Market', desc: 'Analyzes competitors & gaps' },
            { step: '03', title: 'Strategic Creation', desc: 'Brand built to outperform' },
            { step: '04', title: 'Launch & Dominate', desc: 'Enter market with advantage' }].
            map((item, i) =>
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center">

                <div className="text-7xl font-extrabold bg-gradient-to-b from-amber-500/30 to-transparent bg-clip-text text-transparent mb-4 tracking-[-0.03em]">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2 tracking-[-0.02em]">{item.title}</h3>
                <p className="text-slate-400 leading-[1.6] tracking-[-0.011em]">{item.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-[-0.02em]">
              Why Choose Our Platform?
            </h2>
            <div className="space-y-6">
              {[
              { icon: Target, title: 'Competitor Intelligence', desc: 'AI analyzes real competitors to find exploitable weaknesses' },
              { icon: Zap, title: 'Strategic Differentiation', desc: 'Every asset designed to fill market gaps' },
              { icon: Shield, title: 'Data-Driven Decisions', desc: 'Brand colors, messaging, and positioning backed by research' },
              { icon: LogoIcon, title: 'Conversion Optimized', desc: 'Content targets keywords and pain points competitors miss' }].
              map((benefit) =>
              <div key={benefit.title} className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 tracking-[-0.02em]">{benefit.title}</h3>
                    <p className="text-slate-400 leading-[1.6] tracking-[-0.011em]">{benefit.desc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            









          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-24">
        <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-800/50 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
          <CardContent className="p-14 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.02em]">
              Start Building Your Business Today
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-[1.6] tracking-[-0.011em]">
              Join thousands of entrepreneurs who launched their businesses with our AI-powered platform
            </p>
            <Link to={createPageUrl('CreateBusiness')}>
              <Button className="h-16 px-12 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xl shadow-amber-500/25 font-semibold">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">

            
            






























          </div>
        </div>
      </div>
    </div>);

}