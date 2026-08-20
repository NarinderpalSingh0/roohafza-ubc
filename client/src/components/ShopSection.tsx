import { ArrowUpRight, Check, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import type { Product } from "@shared/commerce/types";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { trpc } from "@/lib/trpc";

const previewCans = [
  { title: "Berry Bust", note: "Roohafza Berry Bust 330 ml", image: "/manus-storage/roohafza-berry-bust_52910888.png", tone: "shop-berry" },
  { title: "Straberry", note: "Roohafza Straberry 330 ml", image: "/manus-storage/roohafza-no-chalan_ef606d6d.png", tone: "shop-red" },
  { title: "Rose", note: "Roohafza Rose 330 ml", image: "/manus-storage/roohafza-nam-rakh-lena_8d4ce84b.png", tone: "shop-cream" },
];

function scrollToStores() {
  document.getElementById("stores")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function LiveShopCard({ product }: { product: Product }) {
  const { addItem, loading } = useCart();
  const [error, setError] = useState("");
  const variant = product.variants[0];
  const image = product.images[0];

  const addToCart = async () => {
    if (!variant) return;
    setError("");
    try {
      await addItem(variant.id);
    } catch {
      setError("We couldn’t add that can just now. Please try again.");
    }
  };

  return (
    <article className="shop-card live-shop-card" id={`shop-${product.handle}`} tabIndex={-1}>
      <div className="shop-card-image">{image ? <img src={image.url} alt={image.altText ?? product.title} /> : <div className="shop-placeholder">Roohafza</div>}</div>
      <div className="shop-card-copy"><span>Roohafza shop</span><h3>{product.title}</h3><p>{product.description || "A bright little can for the moment you’re in."}</p><div className="shop-card-bottom"><b>{formatMoney(product.priceRange.min)}</b><button type="button" disabled={!variant?.availableForSale || loading} onClick={addToCart}>{loading ? "Adding…" : variant?.availableForSale ? "Add to bag" : "Sold out"}<ShoppingBag size={15} /></button></div>{error && <small className="shop-error">{error}</small>}</div>
    </article>
  );
}

export function ShopSection() {
  const { data: products = [], isLoading } = trpc.commerce.products.list.useQuery({ first: 3 }, { retry: false });
  const { cart, isOpen, itemCount, closeCart, proceedToCheckout, removeItem, updateQuantity, loading } = useCart();

  return (
    <section className="shop-section section-pad" id="shop" aria-labelledby="shop-title">
      <div className="shop-heading"><div><span className="section-kicker light"><i />Roohafza shop</span><h2 id="shop-title">Pick your<br /><em>feeling.</em></h2></div><p>Bright cans, instant mood. Browse the shop online when the verified collection is live, or find a nearby retailer today.</p></div>
      {products.length > 0 ? <div className="shop-grid">{products.map((product) => <LiveShopCard key={product.id} product={product} />)}</div> : <div className="shop-preview"><div className="shop-grid">{previewCans.map((can) => <article className={`shop-card ${can.tone}`} key={can.title}><div className="shop-card-image"><img src={can.image} alt={`${can.title} Roohafza can`} /></div><div className="shop-card-copy"><span>Coming to the shop</span><h3>{can.title}</h3><p>{can.note}</p><button type="button" onClick={scrollToStores}>Find near you <ArrowUpRight size={15} /></button></div></article>)}</div><div className="shop-preview-note"><Check size={17} /><span>{isLoading ? "Checking the online shelf…" : "Online checkout will appear here once the verified Roohafza collection and prices are published."}</span></div></div>}
      <div className="shop-actions"><button type="button" className="shop-find-button" onClick={scrollToStores}>Find a can near you <ArrowUpRight size={17} /></button><a href="https://www.instagram.com/roohfza_?utm_source=ig_web_button_share_sheet" target="_blank" rel="noreferrer">Follow new drops on Instagram <ArrowUpRight size={17} /></a></div>
      {isOpen && <aside className="cart-sheet" aria-label="Shopping bag"><button className="cart-close" type="button" onClick={closeCart} aria-label="Close shopping bag"><X size={19} /></button><span className="section-kicker"><i />Your bag</span><h3>{itemCount ? `${itemCount} can${itemCount === 1 ? "" : "s"} ready` : "Your bag is empty"}</h3>{cart?.items.map((item) => <div className="cart-line" key={item.lineId}><div><b>{item.productTitle}</b><span>{formatMoney(item.lineTotal)}</span></div><div><button type="button" onClick={() => updateQuantity(item.lineId, Math.max(0, item.quantity - 1))}>−</button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.lineId, item.quantity + 1)}>+</button><button type="button" className="cart-remove" onClick={() => removeItem(item.lineId)}>Remove</button></div></div>)}{cart?.itemCount ? <button className="checkout-button" type="button" disabled={loading} onClick={proceedToCheckout}>Checkout securely <ArrowUpRight size={16} /></button> : <button className="checkout-button" type="button" onClick={() => { closeCart(); scrollToStores(); }}>Find a retailer <ArrowUpRight size={16} /></button>}</aside>}
    </section>
  );
}
