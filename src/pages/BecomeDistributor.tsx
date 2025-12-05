import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserPlus,
  FileText,
  Phone,
  Mail,
  MapPin,
  Building2,
  CreditCard,
  Smartphone,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSiteInfo } from '@/lib/storage'

export default function BecomeDistributor() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    region: '',
    ghanaCardNumber: '',
    ghanaCardPhoto: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    momoNetwork: '',
    momoNumber: '',
    momoName: '',
    businessExperience: '',
    whyDistributor: '',
  })

  const ghanaNetworks = [
    'MTN Mobile Money',
    'Vodafone Cash',
    'AirtelTigo Money'
  ]

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate only required fields (excluding optional: businessExperience, whyDistributor, ghanaCardPhoto, bank details)
    const requiredFields = [
      'fullName',
      'email',
      'phone',
      'whatsapp',
      'address',
      'city',
      'region',
      'ghanaCardNumber',
      'momoNetwork',
      'momoNumber',
      'momoName',
    ]

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in all required fields`)
        setLoading(false)
        return
      }
    }

    // Format message for WhatsApp
    const siteInfo = getSiteInfo()
    const whatsappNumber = (siteInfo?.whatsapp || '233599004548').replace(/[^0-9]/g, '')

    const message = `🎯 NEW DISTRIBUTOR REGISTRATION
📋 From: ${siteInfo?.name || 'Tasly Ghana 346'} Website

👤 PERSONAL INFORMATION
━━━━━━━━━━━━━━━━━━━━━
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
WhatsApp: ${formData.whatsapp}

📍 LOCATION
━━━━━━━━━━━━━━━━━━━━━
Address: ${formData.address}
City: ${formData.city}
Region: ${formData.region}

🆔 GHANA CARD
━━━━━━━━━━━━━━━━━━━━━
Card Number: ${formData.ghanaCardNumber}
${formData.ghanaCardPhoto ? `Card Photo: ${formData.ghanaCardPhoto}` : ''}

${formData.bankName ? `🏦 BANK DETAILS
━━━━━━━━━━━━━━━━━━━━━
Bank Name: ${formData.bankName}
Account Number: ${formData.accountNumber}
Account Name: ${formData.accountName}

` : ''}

📱 MOBILE MONEY
━━━━━━━━━━━━━━━━━━━━━
Network: ${formData.momoNetwork}
MoMo Number: ${formData.momoNumber}
MoMo Name: ${formData.momoName}

💼 EXPERIENCE & MOTIVATION
━━━━━━━━━━━━━━━━━━━━━
${formData.businessExperience ? `Business Experience:\n${formData.businessExperience}\n\n` : ''}${formData.whyDistributor ? `Why Become Distributor:\n${formData.whyDistributor}` : ''}

---
Sent from ${siteInfo?.name || 'Tasly Ghana 346'} Website
Date: ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })}`

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')

    // Reset form after short delay
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        city: '',
        region: '',
        ghanaCardNumber: '',
        ghanaCardPhoto: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        momoNetwork: '',
        momoNumber: '',
        momoName: '',
        businessExperience: '',
        whyDistributor: '',
      })
      setLoading(false)
      toast.success('Registration sent! We will contact you shortly.')
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12 bg-gradient-to-br from-primary/5 via-background to-green-50"
    >
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Become a <span className="text-primary">Tasly Distributor</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our network of successful distributors and build a thriving business
            with authentic Tasly health products. Fill out the form below to get started.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Building2,
              title: 'Business Support',
              desc: 'Complete training and marketing materials',
            },
            {
              icon: CreditCard,
              title: 'Attractive Margins',
              desc: 'Competitive pricing and profit margins',
            },
            {
              icon: CheckCircle2,
              title: 'Authentic Products',
              desc: 'Direct supply of genuine Tasly products',
            },
          ].map((benefit, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <benefit.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Distributor Registration Form</CardTitle>
              <p className="text-sm text-muted-foreground">
                All fields marked with * are required
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+233 XX XXX XXXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">
                        <Smartphone className="w-4 h-4 inline mr-1" />
                        WhatsApp Number *
                      </Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="+233 XX XXX XXXX"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Physical Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address, House number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City/Town *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Accra"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region *</Label>
                      <select
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Region</option>
                        <option value="Greater Accra">Greater Accra</option>
                        <option value="Ashanti">Ashanti</option>
                        <option value="Central">Central</option>
                        <option value="Eastern">Eastern</option>
                        <option value="Western">Western</option>
                        <option value="Western North">Western North</option>
                        <option value="Volta">Volta</option>
                        <option value="Oti">Oti</option>
                        <option value="Northern">Northern</option>
                        <option value="Savannah">Savannah</option>
                        <option value="North East">North East</option>
                        <option value="Upper East">Upper East</option>
                        <option value="Upper West">Upper West</option>
                        <option value="Bono">Bono</option>
                        <option value="Bono East">Bono East</option>
                        <option value="Ahafo">Ahafo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ghana Card */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Ghana Card Verification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ghanaCardNumber">Ghana Card Number *</Label>
                      <Input
                        id="ghanaCardNumber"
                        name="ghanaCardNumber"
                        value={formData.ghanaCardNumber}
                        onChange={handleChange}
                        placeholder="GHA-XXXXXXXXX-X"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ghanaCardPhoto">Ghana Card Photo URL (Optional)</Label>
                      <Input
                        id="ghanaCardPhoto"
                        name="ghanaCardPhoto"
                        value={formData.ghanaCardPhoto}
                        onChange={handleChange}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Bank Account Details (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <select
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Bank</option>
                        <option value="Access Bank">Access Bank</option>
                        <option value="Absa Bank">Absa Bank</option>
                        <option value="ADB Bank">ADB Bank</option>
                        <option value="Cal Bank">Cal Bank</option>
                        <option value="Consolidated Bank">Consolidated Bank</option>
                        <option value="Ecobank">Ecobank</option>
                        <option value="FBNBank">FBNBank</option>
                        <option value="Fidelity Bank">Fidelity Bank</option>
                        <option value="First Atlantic Bank">First Atlantic Bank</option>
                        <option value="First National Bank">First National Bank</option>
                        <option value="GCB Bank">GCB Bank</option>
                        <option value="Guaranty Trust Bank">Guaranty Trust Bank</option>
                        <option value="National Investment Bank">National Investment Bank</option>
                        <option value="OmniBSIC Bank">OmniBSIC Bank</option>
                        <option value="Prudential Bank">Prudential Bank</option>
                        <option value="Republic Bank">Republic Bank</option>
                        <option value="Société Générale">Société Générale</option>
                        <option value="Stanbic Bank">Stanbic Bank</option>
                        <option value="Standard Chartered Bank">Standard Chartered Bank</option>
                        <option value="UBA Ghana">UBA Ghana</option>
                        <option value="Universal Merchant Bank">Universal Merchant Bank</option>
                        <option value="Zenith Bank">Zenith Bank</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="XXXXXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleChange}
                        placeholder="Name as it appears on bank account"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Money */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Mobile Money Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="momoNetwork">MoMo Network *</Label>
                      <select
                        id="momoNetwork"
                        name="momoNetwork"
                        value={formData.momoNetwork}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Network</option>
                        {ghanaNetworks.map((network) => (
                          <option key={network} value={network}>{network}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="momoNumber">MoMo Number *</Label>
                      <Input
                        id="momoNumber"
                        name="momoNumber"
                        type="tel"
                        value={formData.momoNumber}
                        onChange={handleChange}
                        placeholder="024XXXXXXX"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="momoName">MoMo Account Name *</Label>
                      <Input
                        id="momoName"
                        name="momoName"
                        value={formData.momoName}
                        onChange={handleChange}
                        placeholder="Name registered on mobile money"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessExperience">Business/Sales Experience (Optional)</Label>
                      <Textarea
                        id="businessExperience"
                        name="businessExperience"
                        value={formData.businessExperience}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Tell us about your business or sales experience..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whyDistributor">Why do you want to become a Tasly distributor? (Optional)</Label>
                      <Textarea
                        id="whyDistributor"
                        name="whyDistributor"
                        value={formData.whyDistributor}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Share your motivation..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full md:w-auto px-12"
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Submit Registration
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  By submitting this form, you agree to our terms and conditions.
                  We will review your application and contact you within 3-5 business days.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
