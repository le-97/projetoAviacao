# 🚀 Aviation Compliance API - Production Deployment Guide

## Overview

This guide covers the complete production deployment of the Aviation Compliance API, including security hardening, monitoring, and operational procedures.

## 📋 Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04 LTS or later recommended)
- **RAM**: Minimum 4GB, recommended 8GB+
- **CPU**: 2+ cores
- **Storage**: 20GB+ available space
- **Network**: Stable internet connection

### Software Dependencies
- Docker 20.10+
- Docker Compose 2.0+
- Git
- curl
- jq (for JSON processing)

### Domain and SSL
- Registered domain name
- Valid SSL certificate (Let's Encrypt recommended)
- DNS configured to point to your server

## 🔐 Security Configuration

### 1. Environment Variables

Copy the production environment template:
```bash
cp .env.production .env
```

**CRITICAL**: Update these security-sensitive variables:

```bash
# Strong JWT secret (generate with: openssl rand -hex 32)
JWT_SECRET_KEY=your-super-secret-32-byte-key

# Encryption key (generate with: openssl rand -hex 32) 
ENCRYPTION_KEY=your-32-byte-encryption-key

# Database passwords
POSTGRES_PASSWORD=strong-postgres-password
REDIS_PASSWORD=strong-redis-password

# Monitoring
GRAFANA_PASSWORD=strong-grafana-password

# Update domains
CORS_ORIGINS=https://your-frontend-domain.com
ALLOWED_HOSTS=your-api-domain.com,localhost
```

### 2. SSL Certificate Setup

For Let's Encrypt:
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d your-api-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-api-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-api-domain.com/privkey.pem nginx/ssl/key.pem
```

### 3. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 🚀 Deployment Process

### 1. Clone Repository

```bash
git clone <repository-url>
cd projetoAviacao
```

### 2. Configure Environment

```bash
# Copy and edit environment file
cp .env.production .env
nano .env  # Update all variables

# Update nginx configuration
nano nginx/nginx.conf  # Update server_name to your domain
```

### 3. Deploy

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh deploy
```

### 4. Verify Deployment

```bash
# Check service status
./deploy.sh status

# View logs
./deploy.sh logs

# Test endpoints
curl https://your-domain.com/health
curl https://your-domain.com/api/docs
```

## 📊 Monitoring and Alerting

### Grafana Dashboard
- URL: `http://your-server:8080/grafana`
- Default credentials: admin / (GRAFANA_PASSWORD from .env)

### Prometheus Metrics
- URL: `http://your-server:8080/prometheus`

### Key Metrics to Monitor
- **Response Time**: API response latency
- **Error Rate**: HTTP 4xx/5xx responses
- **CPU Usage**: System CPU utilization
- **Memory Usage**: System memory consumption
- **Database Performance**: Query execution time
- **Security Events**: Failed authentication attempts

### Alert Rules
Configured alerts for:
- High CPU usage (>80% for 5 minutes)
- High memory usage (>90% for 5 minutes)
- High error rate (>10 errors in 3 minutes)
- Slow response time (>2 seconds for 5 minutes)

## 🔧 Operational Procedures

### Daily Operations

1. **Health Checks**
   ```bash
   ./deploy.sh status
   curl -f https://your-domain.com/health
   ```

2. **Log Monitoring**
   ```bash
   ./deploy.sh logs | grep ERROR
   ```

3. **Metrics Review**
   - Check Grafana dashboard
   - Review alert notifications

### Weekly Operations

1. **Backup Verification**
   ```bash
   ./deploy.sh backup
   ls -la backups/
   ```

2. **Security Audit**
   ```bash
   # Check for failed authentication attempts
   docker-compose -f docker-compose.prod.yml logs aviation-compliance-api | grep "authentication_failed"
   
   # Review rate limiting events
   docker-compose -f docker-compose.prod.yml logs aviation-compliance-api | grep "rate_limit"
   ```

3. **Performance Review**
   - Analyze response time trends
   - Review database query performance
   - Check system resource usage

### Monthly Operations

1. **Security Updates**
   ```bash
   # Update base images
   docker-compose -f docker-compose.prod.yml pull
   ./deploy.sh update
   ```

2. **Certificate Renewal** (if using Let's Encrypt)
   ```bash
   sudo certbot renew --dry-run
   ```

3. **Backup Cleanup**
   ```bash
   ./deploy.sh cleanup
   ```

## 🚨 Incident Response

### Service Down
1. Check service status: `./deploy.sh status`
2. View recent logs: `./deploy.sh logs`
3. Restart services: `./deploy.sh restart`
4. If issues persist: `./deploy.sh rollback`

### High Error Rate
1. Check application logs for error patterns
2. Review recent deployments
3. Check database connectivity
4. Monitor system resources

### Security Incident
1. Check audit logs: `docker-compose logs | grep security`
2. Review failed authentication attempts
3. Check for suspicious IP patterns
4. Update security rules if necessary

## 🔄 Deployment Updates

### Rolling Updates
```bash
# Update code
git pull origin main

# Deploy new version
./deploy.sh update
```

### Rollback Procedure
```bash
# Immediate rollback
./deploy.sh rollback

# Check status
./deploy.sh status
```

## 🔍 Troubleshooting

### Common Issues

1. **Service Won't Start**
   - Check environment variables
   - Verify Docker daemon is running
   - Check port availability

2. **SSL Certificate Issues**
   - Verify certificate files exist
   - Check certificate expiration
   - Validate nginx configuration

3. **Database Connection Errors**
   - Check database service status
   - Verify connection string
   - Check database logs

4. **High Memory Usage**
   - Monitor application logs
   - Check for memory leaks
   - Consider scaling up

### Diagnostic Commands

```bash
# Check all containers
docker-compose -f docker-compose.prod.yml ps

# View resource usage
docker stats

# Check nginx configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Database health
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Redis connectivity
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping
```

## 📈 Performance Optimization

### Database Optimization
- Regular VACUUM and ANALYZE operations
- Index optimization for frequent queries
- Connection pooling configuration

### Application Tuning
- Adjust worker process count based on CPU cores
- Configure request timeout values
- Optimize cache settings

### System Optimization
- Tune kernel parameters for high-load scenarios
- Configure log rotation
- Optimize Docker resource limits

## 🔐 Security Best Practices

### Regular Security Tasks
1. **Update Dependencies**: Monthly security updates
2. **Rotate Secrets**: Quarterly rotation of API keys and passwords
3. **Access Review**: Regular review of user access and permissions
4. **Security Scanning**: Regular vulnerability scans

### Compliance Checks
- Ensure all security headers are present
- Verify SSL/TLS configuration
- Check for exposed sensitive information
- Validate input sanitization

## 📞 Support and Contacts

### Emergency Contacts
- **System Administrator**: [Contact Information]
- **Security Team**: [Contact Information]
- **Database Administrator**: [Contact Information]

### Documentation Resources
- API Documentation: `https://your-domain.com/api/docs`
- System Architecture: [Link to architecture docs]
- Incident Playbooks: [Link to incident response docs]

## 📝 Change Log

Track all production changes:
- **Date**: Change description
- **Version**: Release version
- **Impact**: System impact assessment
- **Rollback**: Rollback procedure if needed

---

**Remember**: Always test changes in a staging environment before deploying to production!