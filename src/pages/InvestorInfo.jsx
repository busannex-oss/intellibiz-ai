import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Zap, Users, DollarSign, Globe, Building2, 
  Rocket, BarChart3, CheckCircle, Mail, Phone, ArrowRight,
  Target, Sparkles, Shield, ChevronRight
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const stats = [
  { value: '50K+', label: 'Businesses Created' },
  { value: '$2.4B+', label: 'Projected Revenue Generated' },
  { value: '180+', label: 'Countries Reached' },
  { value: '98%', label: 'User Satisfaction Rate' },
];

const partnerships = [
  {
    icon: Building2,
    title: 'Strategic Investment',
    description: 'Join us as an equity investor and be part of the AI revolution in business creation. Access quarterly reports, board observer rights, and co-investment opportunities.',
    color: 'from-violet-500 to-purple-600'
  },
  {
    icon: Globe,
    title: 'Enterprise Licensing',
    description: 'White-label BrandForge for your institution, bank, or accelerator. Bring AI-powered business building to your ecosystem and client base.',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Rocket,
    title: 'Accelerator & Incubator',
    description: 'Integrate BrandForge into your startup programs. Give your cohort access to instant market research, branding, and financial modeling tools.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: Users,
    title: 'Affiliate & Distribution',
    description: 'Grow revenue by introducing BrandForge to your network of entrepreneurs, business coaches, and communities. Earn recurring commissions.',
    color: 'from-emerald-500 to-green-600'
  },
  {
    icon: BarChart3,
    title: 'Data & Research Partnerships',
    description: 'Collaborate on industry research, trend reports, and insights drawn from one of the largest AI-generated business data sets in the world.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: Shield,
    title: 'Government & EDU Programs',
    description: 'Partner with us to bring AI business education to underserved communities, municipalities, HBCUs, and workforce development programs.',
    color: 'from-teal-500 to-cyan-600'
  },
];

const impactStats = [
  { value: '50K+', label: 'Businesses Launched', icon: Rocket },
  { value: '$180M+', label: 'Raised by BrandForge Users', icon: DollarSign },
  { value: '4.9★', label: 'Average Platform Rating', icon: Target },
  { value: '92%', label: 'Business Plan Accuracy', icon: CheckCircle },
];

const investorTypes = [
  {
    title: 'Venture Capital Firms',
    items: ['Pre-Seed & Seed Rounds', 'Series A Expansion', 'Lead or Follow-On Rounds', 'Strategic Portfolio Add-On'],
  },
  {
    title: 'Corporations & Banks',
    items: ['CRA Investment Programs', 'CSR & ESG Initiatives', 'Innovation Labs & Digital Transformation', 'White-Label Licensing Deals'],
  },
  {
    title: 'Angel Investors',
    items: ['Individual Angel Investments', 'Angel Syndicate Participation', 'Advisory Roles with Equity', 'Convertible Notes'],
  },
  {
    title: 'Institutions & Foundations',
    items: ['Workforce Development Grants', 'Entrepreneurship Education Funding', 'HBCU & Minority Business Programs', 'Economic Empowerment Initiatives'],
  },
];

const pressLogos = ['Forbes', 'TechCrunch', 'Inc.', 'Fast Company', 'Bloomberg', 'Entrepreneur'];

const budgetOptions = [
  'Open / Exploratory',
  '$10K – $50K',
  '$50K – $250K',
  '$250K – $1M',
  '$1M – $5M',
  '$5M+',
];

const goalOptions = [
  'Equity Investment (Seed / Series A)',
  'Enterprise or White-Label Licensing',
  'Accelerator / Incubator Integration',
  'Affiliate & Distribution Partnership',
  'Government / Educational Program',
  'Other',
];

export default function InvestorInfo() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    company: '',
    title: '',
    phone: '',
    email: '',
    budget: '',
    goals: [],
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleGoal = (goal) => {
    setForm(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter(g => g !== goal) : [...prev.goals, goal]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.first_name) {
      toast.error('Please fill in your name and email');
      return;
    }
    setSubmitting(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: 'investors@brandforge.ai',
        subject: `New Investor Inquiry from ${form.first_name} ${form.last_name} – ${form.company}`,
        body: `
Name: ${form.first_name} ${form.last_name}
Company: ${form.company}
Title: ${form.title}
Phone: ${form.phone}
Email: ${form.email}
Budget Range: ${form.budget}
Goals: ${form.goals.join(', ')}
Message: ${form.message}
        `.trim()
      });
      setSubmitted(true);
      toast.success('Your inquiry has been sent!');
    } catch (err) {
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6 text-sm px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Investment & Partnership Opportunities
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Let's Build the Future of
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Business — Together
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-4 max-w-2xl leading-relaxed">
              BrandForge is redefining how businesses are born. We're looking for visionary partners, investors, and institutions ready to back the AI platform that powers the next generation of entrepreneurs.
            </p>
            <p className="text-lg text-amber-400 font-semibold italic mb-10">
              Join a movement that has already helped 50,000+ entrepreneurs launch their dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact">
                <Button className="h-14 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-semibold shadow-xl shadow-amber-500/20">
                  Let's Talk Partnership
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <a href="#opportunities">
                <Button variant="outline" className="h-14 px-8 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-lg">
                  View Opportunities
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 bg-slate-800/60 border-y border-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-400 font-semibold uppercase tracking-widest text-sm mb-4">Who We Are</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                Driven by Purpose.<br />Built for Impact.
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                <strong className="text-white">BrandForge</strong> is an AI-powered business creation platform that transforms an idea into a fully operational brand — complete with market research, logo, business plan, financial projections, website content, phone systems, and marketing strategy — in minutes.
              </p>
              <p className="text-slate-300 leading-relaxed mb-8">
                We serve entrepreneurs, small business owners, accelerators, and institutions across 180+ countries. Our platform replaces what once cost thousands of dollars in consultants and months of work.
              </p>
              <div className="flex flex-wrap gap-3">
                {['AI-Powered', 'SaaS Model', 'Global Reach', 'B2B + B2C'].map(tag => (
                  <Badge key={tag} className="bg-slate-700 text-slate-300 border-slate-600 px-4 py-1.5 text-sm">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {impactStats.map((stat, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center hover:border-amber-500/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section id="opportunities" className="py-20 px-4 bg-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-semibold uppercase tracking-widest text-sm mb-4">Partnership Opportunities</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Let's Create Value-Driven Collaborations
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              We work with investors, brands, and institutions committed to impact, innovation, and transformation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerships.map((p, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-slate-500 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <p.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                <p className="text-slate-400 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-semibold uppercase tracking-widest text-sm mb-4">Who We Work With</p>
            <h2 className="text-4xl font-bold text-white tracking-tight">Who Invests & Partners With BrandForge</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investorTypes.map((type, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-amber-500/30 transition-colors">
                <h3 className="text-white font-bold text-lg mb-4 pb-4 border-b border-slate-700">{type.title}</h3>
                <ul className="space-y-3">
                  {type.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                      <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press / Credibility */}
      <section className="py-12 px-4 bg-slate-800/40 border-y border-slate-700">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-slate-500 text-sm uppercase tracking-widest mb-8">As Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {pressLogos.map((logo, i) => (
              <span key={i} className="text-slate-500 font-bold text-xl tracking-tight hover:text-slate-300 transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 font-semibold uppercase tracking-widest text-sm mb-4">Get In Touch</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Let's Explore What's Possible
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Tell us about your goals and we'll follow up with a tailored collaboration proposal within 48 hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center bg-slate-800 border border-emerald-500/30 rounded-2xl p-16">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
              <p className="text-slate-400 text-lg">We've received your inquiry and will be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 md:p-12 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300 mb-2 block">First Name *</Label>
                  <Input
                    value={form.first_name}
                    onChange={e => setForm({...form, first_name: e.target.value})}
                    placeholder="Jane"
                    className="bg-slate-900 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300 mb-2 block">Last Name</Label>
                  <Input
                    value={form.last_name}
                    onChange={e => setForm({...form, last_name: e.target.value})}
                    placeholder="Smith"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300 mb-2 block">Company Name</Label>
                  <Input
                    value={form.company}
                    onChange={e => setForm({...form, company: e.target.value})}
                    placeholder="Acme Ventures"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300 mb-2 block">Title / Role</Label>
                  <Input
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="Managing Partner"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300 mb-2 block">Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="jane@example.com"
                    className="bg-slate-900 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300 mb-2 block">Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300 mb-2 block">Investment / Budget Range</Label>
                <select
                  value={form.budget}
                  onChange={e => setForm({...form, budget: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select a range</option>
                  {budgetOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <Label className="text-slate-300 mb-3 block">What are your goals in partnering with BrandForge?</Label>
                <div className="flex flex-wrap gap-2">
                  {goalOptions.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        form.goals.includes(goal)
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-slate-300 mb-2 block">Tell Us More</Label>
                <Textarea
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Share any additional context about your vision, timeline, or specific questions..."
                  className="bg-slate-900 border-slate-700 text-white min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/20"
              >
                {submitting ? 'Sending...' : (
                  <>
                    Send My Inquiry
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-slate-500 text-sm">
                By submitting, you consent to BrandForge storing and processing your information to respond to your inquiry.
              </p>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}