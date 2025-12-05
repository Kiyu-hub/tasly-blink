import { Link } from 'react-router-dom'
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Heart,
} from 'lucide-react'
import { getSiteInfo } from '@/lib/storage'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  const siteInfo = getSiteInfo()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-green-600">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="font-display text-xl font-bold">
                Tasly Ghana <span className="text-primary">346</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in natural health and wellness. Premium quality
              supplements for a healthier you.
            </p>
            <div className="flex space-x-3">
              {siteInfo.socialMedia?.facebook && (
                <a
                  href={siteInfo.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {siteInfo.socialMedia?.instagram && (
                <a
                  href={siteInfo.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {siteInfo.socialMedia?.twitter && (
                <a
                  href={siteInfo.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {siteInfo.socialMedia?.youtube && (
                <a
                  href={siteInfo.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
                >
                  <Youtube className="h-5 w-5" />
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
            © {new Date().getFullYear()} Tasly Ghana 346. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> in Ghana
          </p>
        </div>
      </div>
    </footer>
  )
}
