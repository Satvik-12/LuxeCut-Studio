"""add site_visits

Revision ID: 5073a1f42277
Revises: 3d0bd660bb9f
Create Date: 2026-06-29 13:32:55.414303

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5073a1f42277'
down_revision: Union[str, Sequence[str], None] = '3d0bd660bb9f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('site_visits',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('session_id', sa.String(length=100), nullable=True),
    sa.Column('page_path', sa.String(length=500), nullable=True),
    sa.Column('referrer', sa.String(length=1000), nullable=True),
    sa.Column('user_agent', sa.Text(), nullable=True),
    sa.Column('ip_address', sa.String(length=45), nullable=True),
    sa.Column('country', sa.String(length=100), nullable=True),
    sa.Column('city', sa.String(length=100), nullable=True),
    sa.Column('device_type', sa.String(length=20), nullable=True),
    sa.Column('browser', sa.String(length=50), nullable=True),
    sa.Column('os', sa.String(length=50), nullable=True),
    sa.Column('screen_width', sa.Integer(), nullable=True),
    sa.Column('screen_height', sa.Integer(), nullable=True),
    sa.Column('visited_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_site_visits_id'), 'site_visits', ['id'], unique=False)
    op.create_index(op.f('ix_site_visits_session_id'), 'site_visits', ['session_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_site_visits_session_id'), table_name='site_visits')
    op.drop_index(op.f('ix_site_visits_id'), table_name='site_visits')
    op.drop_table('site_visits')
