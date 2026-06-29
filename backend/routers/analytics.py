from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, distinct
from datetime import datetime, timedelta
import httpx
import database, schemas, models, auth
from user_agents import parse as parse_ua

router = APIRouter(tags=["Analytics"])


def _parse_user_agent(ua_string: str):
    """Parse user agent string to extract device type, browser, and OS."""
    if not ua_string:
        return "unknown", "unknown", "unknown"
    
    try:
        ua = parse_ua(ua_string)
        
        # Device type
        if ua.is_mobile:
            device_type = "mobile"
        elif ua.is_tablet:
            device_type = "tablet"
        else:
            device_type = "desktop"
        
        browser = ua.browser.family or "unknown"
        os = ua.os.family or "unknown"
        
        return device_type, browser, os
    except Exception:
        return "unknown", "unknown", "unknown"


async def _get_geo_info(ip: str):
    """Get geographic location from IP address using ip-api.com."""
    if not ip or ip in ("127.0.0.1", "localhost", "::1"):
        return None, None
    
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            response = await client.get(f"http://ip-api.com/json/{ip}?fields=status,country,city")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    return data.get("country"), data.get("city")
    except Exception:
        pass
    
    return None, None


@router.post("/api/analytics/track")
async def track_visit(visit: schemas.SiteVisitCreate, request: Request, db: Session = Depends(database.get_db)):
    """Track a page visit — called by the frontend on every route change."""
    
    # Get client IP
    ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
    if not ip:
        ip = request.client.host if request.client else None
    
    # Parse user agent
    ua_string = request.headers.get("user-agent", "")
    device_type, browser, os_name = _parse_user_agent(ua_string)
    
    # Get geo info (async, with timeout so it doesn't block)
    country, city = await _get_geo_info(ip)
    
    db_visit = models.SiteVisit(
        session_id=visit.session_id,
        page_path=visit.page_path,
        referrer=visit.referrer,
        user_agent=ua_string,
        ip_address=ip,
        country=country,
        city=city,
        device_type=device_type,
        browser=browser,
        os=os_name,
        screen_width=visit.screen_width,
        screen_height=visit.screen_height
    )
    
    db.add(db_visit)
    db.commit()
    
    return {"status": "tracked"}


@router.get("/api/admin/analytics/overview", response_model=schemas.AnalyticsOverview)
def get_analytics_overview(
    current_user: models.AdminUser = Depends(auth.get_current_admin),
    db: Session = Depends(database.get_db)
):
    """Get aggregated analytics data for the admin dashboard."""
    
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=now.weekday())
    month_start = today_start.replace(day=1)
    
    # Total visits
    total_visits = db.query(func.count(models.SiteVisit.id)).scalar() or 0
    
    # Visits today
    visits_today = db.query(func.count(models.SiteVisit.id)).filter(
        models.SiteVisit.visited_at >= today_start
    ).scalar() or 0
    
    # Visits this week
    visits_this_week = db.query(func.count(models.SiteVisit.id)).filter(
        models.SiteVisit.visited_at >= week_start
    ).scalar() or 0
    
    # Visits this month
    visits_this_month = db.query(func.count(models.SiteVisit.id)).filter(
        models.SiteVisit.visited_at >= month_start
    ).scalar() or 0
    
    # Unique visitors (by session_id)
    unique_visitors = db.query(func.count(distinct(models.SiteVisit.session_id))).scalar() or 0
    
    # Top pages
    top_pages_query = db.query(
        models.SiteVisit.page_path,
        func.count(models.SiteVisit.id).label("visit_count")
    ).group_by(models.SiteVisit.page_path).order_by(
        func.count(models.SiteVisit.id).desc()
    ).limit(10).all()
    
    top_pages = [schemas.PageStat(page_path=row[0], visit_count=row[1]) for row in top_pages_query]
    
    # Top countries
    top_countries_query = db.query(
        models.SiteVisit.country,
        func.count(models.SiteVisit.id).label("visit_count")
    ).filter(
        models.SiteVisit.country.isnot(None)
    ).group_by(models.SiteVisit.country).order_by(
        func.count(models.SiteVisit.id).desc()
    ).limit(10).all()
    
    top_countries = [schemas.LocationStat(location=row[0], visit_count=row[1]) for row in top_countries_query]
    
    # Top cities
    top_cities_query = db.query(
        models.SiteVisit.city,
        func.count(models.SiteVisit.id).label("visit_count")
    ).filter(
        models.SiteVisit.city.isnot(None)
    ).group_by(models.SiteVisit.city).order_by(
        func.count(models.SiteVisit.id).desc()
    ).limit(10).all()
    
    top_cities = [schemas.LocationStat(location=row[0], visit_count=row[1]) for row in top_cities_query]
    
    # Device breakdown
    device_query = db.query(
        models.SiteVisit.device_type,
        func.count(models.SiteVisit.id).label("visit_count")
    ).filter(
        models.SiteVisit.device_type.isnot(None)
    ).group_by(models.SiteVisit.device_type).order_by(
        func.count(models.SiteVisit.id).desc()
    ).all()
    
    device_breakdown = [schemas.DeviceStat(device_type=row[0], visit_count=row[1]) for row in device_query]
    
    # Browser breakdown
    browser_query = db.query(
        models.SiteVisit.browser,
        func.count(models.SiteVisit.id).label("visit_count")
    ).filter(
        models.SiteVisit.browser.isnot(None)
    ).group_by(models.SiteVisit.browser).order_by(
        func.count(models.SiteVisit.id).desc()
    ).limit(10).all()
    
    browser_breakdown = [schemas.BrowserStat(browser=row[0], visit_count=row[1]) for row in browser_query]
    
    # Hourly breakdown (last 7 days)
    hourly_query = db.query(
        extract('hour', models.SiteVisit.visited_at).label("hour"),
        func.count(models.SiteVisit.id).label("visit_count")
    ).filter(
        models.SiteVisit.visited_at >= now - timedelta(days=7)
    ).group_by(
        extract('hour', models.SiteVisit.visited_at)
    ).order_by(
        extract('hour', models.SiteVisit.visited_at)
    ).all()
    
    hourly_breakdown = [schemas.HourlyStat(hour=int(row[0]), visit_count=row[1]) for row in hourly_query]
    
    # Recent visits (last 50)
    recent_visits_query = db.query(models.SiteVisit).order_by(
        models.SiteVisit.visited_at.desc()
    ).limit(50).all()
    
    return {
        "total_visits": total_visits,
        "visits_today": visits_today,
        "visits_this_week": visits_this_week,
        "visits_this_month": visits_this_month,
        "unique_visitors": unique_visitors,
        "top_pages": top_pages,
        "top_countries": top_countries,
        "top_cities": top_cities,
        "device_breakdown": device_breakdown,
        "browser_breakdown": browser_breakdown,
        "hourly_breakdown": hourly_breakdown,
        "recent_visits": recent_visits_query
    }
