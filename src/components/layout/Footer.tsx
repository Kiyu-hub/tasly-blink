import { Link } from 'react-router-dom'
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  UserPlus,
} from 'lucide-react'
import { getSiteInfo } from '@/lib/storage'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  const siteInfo = getSiteInfo()
  const logoUrl = siteInfo?.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5bpjWLc7v0MJ8EVqLPSOweMBQmvVU94YYw&s'

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={logoUrl} 
                alt={siteInfo?.name || "Tasly Ghana 346"} 
                className="h-10 w-10 object-contain"
              />
              <span className="font-display text-xl font-bold">
                Tasly Ghana <span className="text-primary">346</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in natural health and wellness. Premium quality
              supplements for a healthier you.
            </p>
            <div className="flex space-x-3">
              {siteInfo.socialMediaDisplay?.showFacebook !== false && siteInfo.socialMedia?.facebook && (
                <a
                  href={siteInfo.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {siteInfo.socialMediaDisplay?.showInstagram !== false && siteInfo.socialMedia?.instagram && (
                <a
                  href={siteInfo.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {siteInfo.socialMediaDisplay?.showTwitter !== false && siteInfo.socialMedia?.twitter && (
                <a
                  href={siteInfo.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {siteInfo.socialMediaDisplay?.showYoutube !== false && siteInfo.socialMedia?.youtube && (
                <a
                  href={siteInfo.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {siteInfo.socialMediaDisplay?.showTiktok !== false && siteInfo.socialMedia?.tiktok && (
                <a
                  href={siteInfo.socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
              )}
              {siteInfo.socialMediaDisplay?.showWhatsApp !== false && siteInfo.socialMedia?.whatsapp && (
                <a
                  href={`https://wa.me/${siteInfo.socialMedia.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/become-distributor"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  Become a Distributor
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=Heart Health"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Heart Health
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Immunity"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Immunity
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Brain Health"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Brain Health
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Digestive Health"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Digestive Health
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Joint Health"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Joint Health
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  {siteInfo.address}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href={`tel:${siteInfo.phone}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {siteInfo.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${siteInfo.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {siteInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteInfo.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Accra, Legon - Bawuleshi | {siteInfo.phone}
          </p>
        </div>
      </div>
    </footer>
  )
}
