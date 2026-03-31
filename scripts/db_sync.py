"""
Supabase Database Sync
Saves variants, posts, and exports to your Supabase database
"""

import os
from datetime import datetime
from typing import Dict, Optional, List
import json
import uuid

class SupabaseSync:
    """Sync variants and posts to Supabase"""
    
    def __init__(self):
        """Initialize Supabase client from environment variables"""
        self.url = os.environ.get('SUPABASE_URL')
        self.key = os.environ.get('SUPABASE_KEY')
        
        if not self.url or not self.key:
            print("⚠ Warning: SUPABASE_URL or SUPABASE_KEY not set in environment")
            self.client = None
        else:
            try:
                from supabase import create_client
                self.client = create_client(self.url, self.key)
                print("✓ Supabase client initialized")
            except ImportError:
                print("Installing supabase-py...")
                os.system("pip install supabase --break-system-packages")
                from supabase import create_client
                self.client = create_client(self.url, self.key)
    
    def save_variant(
        self,
        concept: str,
        html_artifact: str,
        png_filename: str,
        variant_num: int,
        score_virality: int = 0,
        score_save_worthy: int = 0,
        score_visual: int = 0,
        score_system_thinking: int = 0,
        score_overall: int = 0,
        design_direction: str = "",
        status: str = "generated"
    ) -> Optional[str]:
        """
        Save variant to database
        Returns: variant_id or None if error
        """
        if not self.client:
            print("✗ Supabase client not initialized")
            return None
        
        try:
            data = {
                'concept': concept,
                'html_artifact': html_artifact,
                'png_filename': png_filename,
                'variant_num': variant_num,
                'score_virality': score_virality,
                'score_save_worthy': score_save_worthy,
                'score_visual': score_visual,
                'score_system_thinking': score_system_thinking,
                'score_overall': score_overall,
                'design_direction': design_direction,
                'status': status,
                'created_at': datetime.utcnow().isoformat()
            }
            
            response = self.client.table('variants').insert(data).execute()
            
            if response.data:
                variant_id = response.data[0]['id']
                print(f"✓ Variant saved: {variant_id}")
                return variant_id
            else:
                print(f"✗ Error saving variant: {response}")
                return None
        
        except Exception as e:
            print(f"✗ Error saving variant: {str(e)}")
            return None
    
    def save_post(
        self,
        variant_id: str,
        post_copy: str,
        first_comment: str,
        linkedin_post_id: Optional[str] = None,
        posted_at: Optional[str] = None
    ) -> Optional[str]:
        """
        Save post copy and first comment for variant
        Returns: post_id or None if error
        """
        if not self.client:
            print("✗ Supabase client not initialized")
            return None
        
        try:
            data = {
                'variant_id': variant_id,
                'post_copy': post_copy,
                'first_comment': first_comment,
                'linkedin_post_id': linkedin_post_id,
                'posted_at': posted_at,
                'created_at': datetime.utcnow().isoformat()
            }
            
            response = self.client.table('posts').insert(data).execute()
            
            if response.data:
                post_id = response.data[0]['id']
                print(f"✓ Post saved: {post_id}")
                return post_id
            else:
                print(f"✗ Error saving post: {response}")
                return None
        
        except Exception as e:
            print(f"✗ Error saving post: {str(e)}")
            return None
    
    def save_export(
        self,
        variant_id: str,
        format: str,
        file_path: str,
        file_size: int = 0
    ) -> Optional[str]:
        """
        Log an export (PNG, PDF, etc.)
        Returns: export_id or None if error
        """
        if not self.client:
            print("✗ Supabase client not initialized")
            return None
        
        try:
            data = {
                'variant_id': variant_id,
                'format': format,
                'file_path': file_path,
                'file_size': file_size,
                'exported_at': datetime.utcnow().isoformat()
            }
            
            response = self.client.table('exports').insert(data).execute()
            
            if response.data:
                export_id = response.data[0]['id']
                print(f"✓ Export logged: {export_id}")
                return export_id
            else:
                print(f"✗ Error logging export: {response}")
                return None
        
        except Exception as e:
            print(f"✗ Error logging export: {str(e)}")
            return None
    
    def get_variant(self, variant_id: str) -> Optional[Dict]:
        """
        Fetch a single variant by ID
        """
        if not self.client:
            print("✗ Supabase client not initialized")
            return None
        
        try:
            response = self.client.table('variants').select('*').eq('id', variant_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"✗ Error fetching variant: {str(e)}")
            return None
    
    def get_variants_by_concept(self, concept: str) -> Optional[List[Dict]]:
        """
        Fetch all variants for a concept
        """
        if not self.client:
            print("✗ Supabase client not initialized")
            return None
        
        try:
            response = self.client.table('variants').select('*').eq('concept', concept).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"✗ Error fetching variants: {str(e)}")
            return None
    
    def update_variant_status(
        self,
        variant_id: str,
        status: str
    ) -> bool:
        """
        Update variant status: generated -> approved -> exported -> posted
        """
        if not self.client:
            print("✗ Supabase client not initialized")
            return False
        
        try:
            self.client.table('variants').update({
                'status': status,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', variant_id).execute()
            
            print(f"✓ Variant {variant_id} status updated to {status}")
            return True
        except Exception as e:
            print(f"✗ Error updating status: {str(e)}")
            return False
    
    def get_posts_for_variant(self, variant_id: str) -> Optional[List[Dict]]:
        """
        Fetch all posts for a variant
        """
        if not self.client:
            print("✗ Supabase client not initialized")
            return None
        
        try:
            response = self.client.table('posts').select('*').eq('variant_id', variant_id).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"✗ Error fetching posts: {str(e)}")
            return None
    
    def get_recent_variants(self, limit: int = 10) -> Optional[List[Dict]]:
        """
        Fetch recent variants ordered by created_at
        """
        if not self.client:
            print("✗ Supabase client not initialized")
            return None
        
        try:
            response = (
                self.client.table('variants')
                .select('*')
                .order('created_at', desc=True)
                .limit(limit)
                .execute()
            )
            return response.data if response.data else []
        except Exception as e:
            print(f"✗ Error fetching recent variants: {str(e)}")
            return None


class BatchSync:
    """Batch operations on multiple variants"""
    
    def __init__(self):
        self.sync = SupabaseSync()
    
    def save_batch(
        self,
        concept: str,
        variants: List[Dict],
        scores: List[Dict]
    ) -> Dict:
        """
        Save entire batch of variants to database
        
        Args:
            concept: The concept name
            variants: List of {'html': str, 'png_filename': str, 'design_direction': str}
            scores: List of score dicts from 360Brew
            
        Returns:
            dict with saved_ids, failed_count, batch_id
        """
        batch_id = str(uuid.uuid4())
        saved_ids = []
        failed_count = 0
        
        for idx, variant in enumerate(variants):
            score = scores[idx] if idx < len(scores) else {}
            
            variant_id = self.sync.save_variant(
                concept=concept,
                html_artifact=variant.get('html', ''),
                png_filename=variant.get('png_filename', ''),
                variant_num=idx + 1,
                score_virality=score.get('virality', 0),
                score_save_worthy=score.get('save_worthy', 0),
                score_visual=score.get('visual', 0),
                score_system_thinking=score.get('system_thinking', 0),
                score_overall=score.get('overall', 0),
                design_direction=variant.get('design_direction', '')
            )
            
            if variant_id:
                saved_ids.append(variant_id)
            else:
                failed_count += 1
        
        return {
            'batch_id': batch_id,
            'concept': concept,
            'total_variants': len(variants),
            'saved_count': len(saved_ids),
            'failed_count': failed_count,
            'saved_ids': saved_ids,
            'saved_at': datetime.utcnow().isoformat()
        }


def test_connection():
    """Test Supabase connection"""
    sync = SupabaseSync()
    if sync.client:
        print("✓ Connection successful")
        
        # Try to fetch recent variants
        variants = sync.get_recent_variants(limit=3)
        if variants:
            print(f"✓ Found {len(variants)} recent variants")
    else:
        print("✗ Connection failed - check SUPABASE_URL and SUPABASE_KEY")


if __name__ == '__main__':
    print("Supabase Sync Module Loaded")
    # Uncomment to test:
    # test_connection()
