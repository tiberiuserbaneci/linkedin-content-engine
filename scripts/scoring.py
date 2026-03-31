"""
360Brew LinkedIn Scoring Algorithm
Scores concepts before building: Virality, Save-Worthiness, Visual Efficiency, System Thinking
Target: 85+. Rebuild if below 70.
"""

from typing import Dict, List, Tuple
from dataclasses import dataclass
import json

@dataclass
class ScoreResult:
    """Score result with breakdown and recommendations"""
    virality: int
    save_worthy: int
    visual: int
    system_thinking: int
    overall: int
    go_rebuild: str  # 'GO' or 'REBUILD'
    weak_points: List[str]
    strengths: List[str]

class BrewAlgorithm:
    """
    360BREW - LinkedIn Virality & Savability Scoring
    
    Dimension 1: VIRALITY (scroll-stop potential) - 25 pts
        ScrollStop (25%) - Line 1 stops the scroll?
        Clarity3s (20%) - Understood in 3 seconds?
        Novelty (20%) - New angle or just another take?
        EmotionalTrigger (20%) - Fear/FOMO/relief/pride?
        FormatFit (15%) - Right format for content type?
    
    Dimension 2: SAVE-WORTHY (algorithm gold) - 25 pts
        UtilityDensity (25%) - Actionable per cm²?
        Reusability (25%) - Will they return to this?
        Compression (20%) - Max value, min words?
        StructureClarity (15%) - Skimmable without reading all?
        Actionability (15%) - Can use today?
    
    Dimension 3: VISUAL EFFICIENCY - 25 pts
        HierarchyStrength (25%) - Eye path obvious?
        ContrastControl (20%) - Dark/light alternation works?
        SpacingBalance (20%) - Breathing room?
        Consistency (20%) - Colors, fonts, spacing systematic?
        NoiseLevel (15%) - Nothing competes for attention?
    
    Dimension 4: SYSTEM THINKING (authority signal) - 25 pts
        FrameworkClarity (30%) - Teachable in one image?
        Modularity (25%) - Components work independently?
        Transferability (25%) - Reader can apply it?
        DepthVsSimplicity (20%) - Deep without complex?
    """
    
    def __init__(self):
        self.dimension_weights = {
            'virality': 0.25,
            'save_worthy': 0.25,
            'visual': 0.25,
            'system_thinking': 0.25
        }
    
    def score_virality(
        self,
        scroll_stop: int = 0,        # 0-100: Does line 1 stop scroll?
        clarity_3s: int = 0,         # 0-100: Understood in 3 seconds?
        novelty: int = 0,            # 0-100: New angle?
        emotional_trigger: int = 0,  # 0-100: Fear/FOMO/relief/pride?
        format_fit: int = 0          # 0-100: Right format for content?
    ) -> Tuple[int, Dict]:
        """
        VIRALITY dimension (25pts)
        Scroll-stop potential: headline, visual impact, format match
        """
        weights = {
            'scroll_stop': 0.25,
            'clarity_3s': 0.20,
            'novelty': 0.20,
            'emotional_trigger': 0.20,
            'format_fit': 0.15
        }
        
        score = (
            scroll_stop * weights['scroll_stop'] +
            clarity_3s * weights['clarity_3s'] +
            novelty * weights['novelty'] +
            emotional_trigger * weights['emotional_trigger'] +
            format_fit * weights['format_fit']
        )
        
        return int(score), {
            'scroll_stop': scroll_stop,
            'clarity_3s': clarity_3s,
            'novelty': novelty,
            'emotional_trigger': emotional_trigger,
            'format_fit': format_fit,
            'weighted_score': score
        }
    
    def score_save_worthy(
        self,
        utility_density: int = 0,    # 0-100: Actionable per cm²?
        reusability: int = 0,        # 0-100: Will return to this?
        compression: int = 0,        # 0-100: Max value, min words?
        structure_clarity: int = 0,  # 0-100: Skimmable structure?
        actionability: int = 0       # 0-100: Can use today?
    ) -> Tuple[int, Dict]:
        """
        SAVE-WORTHY dimension (25pts)
        Algorithm gold: utility density, compression, structure clarity
        """
        weights = {
            'utility_density': 0.25,
            'reusability': 0.25,
            'compression': 0.20,
            'structure_clarity': 0.15,
            'actionability': 0.15
        }
        
        score = (
            utility_density * weights['utility_density'] +
            reusability * weights['reusability'] +
            compression * weights['compression'] +
            structure_clarity * weights['structure_clarity'] +
            actionability * weights['actionability']
        )
        
        return int(score), {
            'utility_density': utility_density,
            'reusability': reusability,
            'compression': compression,
            'structure_clarity': structure_clarity,
            'actionability': actionability,
            'weighted_score': score
        }
    
    def score_visual_efficiency(
        self,
        hierarchy_strength: int = 0,  # 0-100: Eye path obvious?
        contrast_control: int = 0,    # 0-100: Dark/light works?
        spacing_balance: int = 0,     # 0-100: Breathing room?
        consistency: int = 0,         # 0-100: Colors, fonts systematic?
        noise_level: int = 0          # 0-100: Clean, uncluttered?
    ) -> Tuple[int, Dict]:
        """
        VISUAL EFFICIENCY dimension (25pts)
        Design quality: hierarchy, contrast, spacing, consistency
        """
        weights = {
            'hierarchy_strength': 0.25,
            'contrast_control': 0.20,
            'spacing_balance': 0.20,
            'consistency': 0.20,
            'noise_level': 0.15
        }
        
        score = (
            hierarchy_strength * weights['hierarchy_strength'] +
            contrast_control * weights['contrast_control'] +
            spacing_balance * weights['spacing_balance'] +
            consistency * weights['consistency'] +
            noise_level * weights['noise_level']
        )
        
        return int(score), {
            'hierarchy_strength': hierarchy_strength,
            'contrast_control': contrast_control,
            'spacing_balance': spacing_balance,
            'consistency': consistency,
            'noise_level': noise_level,
            'weighted_score': score
        }
    
    def score_system_thinking(
        self,
        framework_clarity: int = 0,   # 0-100: Teachable in one image?
        modularity: int = 0,          # 0-100: Components independent?
        transferability: int = 0,     # 0-100: Applicable to reader?
        depth_vs_simplicity: int = 0  # 0-100: Deep but simple?
    ) -> Tuple[int, Dict]:
        """
        SYSTEM THINKING dimension (25pts)
        Authority signal: teachability, modularity, transferability
        """
        weights = {
            'framework_clarity': 0.30,
            'modularity': 0.25,
            'transferability': 0.25,
            'depth_vs_simplicity': 0.20
        }
        
        score = (
            framework_clarity * weights['framework_clarity'] +
            modularity * weights['modularity'] +
            transferability * weights['transferability'] +
            depth_vs_simplicity * weights['depth_vs_simplicity']
        )
        
        return int(score), {
            'framework_clarity': framework_clarity,
            'modularity': modularity,
            'transferability': transferability,
            'depth_vs_simplicity': depth_vs_simplicity,
            'weighted_score': score
        }
    
    def calculate_overall(
        self,
        virality: int,
        save_worthy: int,
        visual: int,
        system_thinking: int
    ) -> int:
        """Calculate overall score from 4 dimensions"""
        overall = (
            virality * self.dimension_weights['virality'] +
            save_worthy * self.dimension_weights['save_worthy'] +
            visual * self.dimension_weights['visual'] +
            system_thinking * self.dimension_weights['system_thinking']
        )
        return int(overall)
    
    def get_weak_points(self, scores: Dict[str, int], threshold: int = 70) -> List[str]:
        """Identify dimensions below threshold"""
        weak = []
        if scores['virality'] < threshold:
            weak.append(f"Virality too low ({scores['virality']}) - hook not strong enough")
        if scores['save_worthy'] < threshold:
            weak.append(f"Save-worthy too low ({scores['save_worthy']}) - needs more utility density")
        if scores['visual'] < threshold:
            weak.append(f"Visual too low ({scores['visual']}) - hierarchy or contrast weak")
        if scores['system_thinking'] < threshold:
            weak.append(f"System thinking too low ({scores['system_thinking']}) - framework unclear")
        return weak
    
    def get_strengths(self, scores: Dict[str, int], threshold: int = 80) -> List[str]:
        """Identify dimensions above 80"""
        strong = []
        if scores['virality'] >= threshold:
            strong.append(f"Strong virality ({scores['virality']}) - scroll-stopping hook")
        if scores['save_worthy'] >= threshold:
            strong.append(f"High save-worthy ({scores['save_worthy']}) - valuable utility")
        if scores['visual'] >= threshold:
            strong.append(f"Excellent visual efficiency ({scores['visual']}) - clean design")
        if scores['system_thinking'] >= threshold:
            strong.append(f"Strong system thinking ({scores['system_thinking']}) - teachable framework")
        return strong
    
    def full_score(
        self,
        scroll_stop: int = 0,
        clarity_3s: int = 0,
        novelty: int = 0,
        emotional_trigger: int = 0,
        format_fit: int = 0,
        utility_density: int = 0,
        reusability: int = 0,
        compression: int = 0,
        structure_clarity: int = 0,
        actionability: int = 0,
        hierarchy_strength: int = 0,
        contrast_control: int = 0,
        spacing_balance: int = 0,
        consistency: int = 0,
        noise_level: int = 0,
        framework_clarity: int = 0,
        modularity: int = 0,
        transferability: int = 0,
        depth_vs_simplicity: int = 0,
    ) -> ScoreResult:
        """
        Full 360Brew scoring in one call
        Returns ScoreResult with all breakdowns and recommendations
        """
        virality, virality_breakdown = self.score_virality(
            scroll_stop, clarity_3s, novelty, emotional_trigger, format_fit
        )
        
        save_worthy, save_worthy_breakdown = self.score_save_worthy(
            utility_density, reusability, compression, structure_clarity, actionability
        )
        
        visual, visual_breakdown = self.score_visual_efficiency(
            hierarchy_strength, contrast_control, spacing_balance, consistency, noise_level
        )
        
        system_thinking, system_thinking_breakdown = self.score_system_thinking(
            framework_clarity, modularity, transferability, depth_vs_simplicity
        )
        
        overall = self.calculate_overall(virality, save_worthy, visual, system_thinking)
        
        scores = {
            'virality': virality,
            'save_worthy': save_worthy,
            'visual': visual,
            'system_thinking': system_thinking
        }
        
        weak_points = self.get_weak_points(scores, threshold=70)
        strengths = self.get_strengths(scores, threshold=80)
        
        go_rebuild = 'GO' if overall >= 70 else 'REBUILD'
        
        return ScoreResult(
            virality=virality,
            save_worthy=save_worthy,
            visual=visual,
            system_thinking=system_thinking,
            overall=overall,
            go_rebuild=go_rebuild,
            weak_points=weak_points,
            strengths=strengths
        )


def format_score_report(result: ScoreResult) -> str:
    """Pretty print score result"""
    report = f"""
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         360BREW SCORE BREAKDOWN                              ║
╚═══════════════════════════════════════════════════════════════════════════════╝

VIRALITY:           {result.virality}/100
SAVE-WORTHY:        {result.save_worthy}/100
VISUAL:             {result.visual}/100
SYSTEM THINKING:    {result.system_thinking}/100
────────────────────────────────────────
OVERALL:            {result.overall}/100

RECOMMENDATION:     {result.go_rebuild}

"""
    
    if result.strengths:
        report += "STRENGTHS:\n"
        for s in result.strengths:
            report += f"  ✓ {s}\n"
        report += "\n"
    
    if result.weak_points:
        report += "WEAK POINTS (fix these):\n"
        for w in result.weak_points:
            report += f"  ✗ {w}\n"
        report += "\n"
    
    report += "╚════════════════════════════════════════════════════════════════════════════════╝\n"
    
    return report


if __name__ == '__main__':
    brew = BrewAlgorithm()
    
    # Example score
    result = brew.full_score(
        scroll_stop=85,
        clarity_3s=90,
        novelty=75,
        emotional_trigger=80,
        format_fit=95,
        utility_density=88,
        reusability=85,
        compression=90,
        structure_clarity=80,
        actionability=85,
        hierarchy_strength=90,
        contrast_control=85,
        spacing_balance=80,
        consistency=85,
        noise_level=90,
        framework_clarity=85,
        modularity=80,
        transferability=85,
        depth_vs_simplicity=80
    )
    
    print(format_score_report(result))
